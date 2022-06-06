import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ApproveInteraction from './ApproveInteraction';
import DepositInteraction from './DepositInteraction';
import ContestInteraction from './ContestInteraction';
import ClaimInteraction from './ClaimInteraction'

export default function ContractInstance({tokenContract, depositContract, depositContractAddress, accounts}) {
    //State variable declaration to track progress
    const [didDeposit, setDidDeposit] = useState(false);
    const [didApprove, setDidApprove] = useState(false);
    const [didContest, setDidContest] = useState(false);
    const [didClaim, setDidClaim] = useState(false);
    const [contestEligible, setContestEligible] = useState(false);
    const [claimEligible, setClaimEligible] = useState(false);
    const [agreedDate, setAgreedDate] = useState(new Date());
    const [deadline, setDeadline] = useState(new Date());
    const [depositAmount, setDepositAmount] = useState();

    //Keep track of emitted events/contract variables to check the stage of the contract if the page is refreshed
    const getApprovalStatus = async () => {
        try {
            const filter = tokenContract.filters.Approval([accounts[0]]);
            const event = await tokenContract.queryFilter(filter);
            const approvals = event.map(event => event.args.spender)
            setDidApprove(approvals.includes(depositContractAddress))
        } catch (error) {
            console.log(error)
        }
    }

    const getDepositStatus = async () => {
        try {
            const filter = tokenContract.filters.Transfer([accounts[0]]);
            const event = await tokenContract.queryFilter(filter);
            const deposits = event.map(event => event.args.to)
            setDidDeposit(deposits.includes(depositContractAddress))
        } catch (error) {
            console.log(error)
        }
    } 
    
    const getContestStatus = async () => {
        try {
            const filter = depositContract.filters.ContestComplete();
            const event = await depositContract.queryFilter(filter);
            if (event[0]) {
                setDidContest(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getClaimStatus = async () => {
        try {
            const filter = depositContract.filters.ClaimComplete();
            const event = await depositContract.queryFilter(filter);
            if (event[0]) {
                setDidClaim(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAgreedDate = async () => {
        try {
            const agreedDateUnix = await depositContract.getAgreedDate();
            const agreedDateReadable = new Date(agreedDateUnix*1000);
            setAgreedDate(agreedDateReadable);
        } catch (error) {
            console.log(error)
        }
    }

    const getDeadline = async () => {
        try {
            const deadlineUnix = await depositContract.getDeadline();
            const deadlineReadable = new Date(deadlineUnix*1000);
            setDeadline(deadlineReadable);
        } catch (error) {
            console.log(error)
        }
    }

    const getDepositAmount = async () => {
        try {
            const depositAmount = await depositContract.getDepositValue();
            setDepositAmount(depositAmount);
        } catch (error) {
            
        }
    }

    const getContestEligibility = async () => {
        try {
            if (didDeposit) {
                const now = new Date();
                setContestEligible(now > agreedDate && now < deadline);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getClaimEligibility = async () => {
        try {
            if(!didContest && didDeposit) {
                const now = new Date();
                setClaimEligible(now > deadline);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getApprovalStatus();
    },[didApprove])

    useEffect(() => {
        getDepositStatus();
    },[didDeposit])

    useEffect(() => {
        getContestStatus();
    },[didContest])

    useEffect(() => {
        getClaimStatus();
    },[didClaim])

    useEffect(() => {
        getDepositAmount();
        getAgreedDate();
        getDeadline();
    },[])

    /* Not only on mount cause it's possible that immediately after deposit you could contest if the agreed upon date is today.
    The other edge case this accounts for is a deposit after the 24 hours from the agreed date which is techincally possible and then
    you can instantly claim. */
    useEffect(() => {
        getContestEligibility();
        getClaimEligibility();
    },[didDeposit])
    
    return (
        <Box>
            {!didApprove && <ApproveInteraction tokenContract={tokenContract} depositContractAddress={depositContractAddress} depositAmount={depositAmount} setDidApprove={setDidApprove}/>}
            {(didApprove && !didDeposit) && <DepositInteraction depositContract={depositContract} setDidDeposit={setDidDeposit}/>}
            {(contestEligible && !didContest) && <ContestInteraction depositContract={depositContract} setDidContest={setDidContest}/>}
            {(claimEligible && !didClaim) && <ClaimInteraction depositContract={depositContract} setDidClaim={setDidClaim}/>}
        </Box>
    )
}