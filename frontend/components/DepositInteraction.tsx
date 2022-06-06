import { Button, Container, Text } from "@chakra-ui/react";
import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import DepositAbi from '../contracts/Deposit.json';


export default function DepositInteraction({contract, tokenContract, approvalAmount, signer, accounts} : 
    {contract: string, tokenContract: Contract, approvalAmount: number, signer: JsonRpcSigner, accounts: string[]}) {
    
    const [didDeposit, setDidDeposit] = useState(false);
    const [didApprove, setDidApprove] = useState(false);
    const [didContest, setDidContest] = useState(false);
    const [didClaim, setDidClaim] = useState(false);
    const [contestEligible, setContestEligible] = useState(false);
    const [claimEligible, setClaimEligible] = useState(false);
    const [agreedDate, setAgreedDate] = useState(new Date());
    const [deadline, setDeadline] = useState(new Date());
    const [approvalLoad, setApprovalLoad] = useState(false);
    const [depositLoad, setDepositLoad] = useState(false);


    const depositContract = new ethers.Contract(contract, DepositAbi.abi, signer)
    
    const handleApprove = async () => {
        try {
            const tx = await tokenContract.approve(contract, approvalAmount);
            setApprovalLoad(true)
            await tx.wait();
            setDidApprove(true);
            console.log('Successful Approval!');
        } catch (error) {
            console.log(error)
        }
    }
        

    const handleDeposit = async () => {
        try {
            const tx = await depositContract.confirmDeposit();
            setDepositLoad(true);
            await tx.wait();
            setDidDeposit(true);
            console.log('Successful Deposit!');
        } catch (error) {
            console.log(error)
        }
    }

    const handleContestItem = async () => {
        try {
            const tx = await depositContract.contestItem();
            await tx.wait();
            setDidContest(true);
            console.log('Deposit contest successful. Deposit returned to buyer')
        } catch (error) {
            console.log(error)
        }
    }

    const handleClaimFunds = async () => {
        try {
            const tx = await depositContract.claimFunds();
            await tx.wait();
            setDidClaim(true);
            console.log('Deposit claim successful!')
        } catch (error) {
            console.log(error)
        }
    }

    const getInfo = async () => {
        try {
            const agreedDateUnix = await depositContract.getAgreedDate();
            const depositValue = await depositContract.getDepositValue();
            const deadlineUnix = await depositContract.getDeadline();
            const currentBlockTime = await depositContract.getCurrentDate();
            const buyer = await depositContract.getBuyer();
            const seller = await depositContract.getSeller();
            const state = await depositContract.getCurrentState();
            console.log(`Deposit value is: ${depositValue.toString()}`);
            console.log(`Agreed date is ${agreedDateUnix.toString()}`);
            console.log(`Deadline is: ${deadlineUnix}`);
            console.log(`Current time is: ${currentBlockTime}`);
            console.log(`Buyer is: ${buyer}`);
            console.log(`Seller is: ${seller}`);
            console.log(`State is: ${state}`);
        } catch (error) {
            console.log(error)
        }
    }

    //This section along with the useEffect hooks keep track of emitted events to check the stage of the contract if the page is refreshed

    const getApprovalStatus = async () => {
        try {
            const filter = tokenContract.filters.Approval([accounts[0]]);
            const event = await tokenContract.queryFilter(filter);
            const approvals = event.map(event => event.args.spender)
            setDidApprove(approvals.includes(contract))
        } catch (error) {
            console.log(error)
        }
    }

    const getDepositStatus = async () => {
        try {
            const filter = tokenContract.filters.Transfer([accounts[0]]);
            const event = await tokenContract.queryFilter(filter);
            const deposits = event.map(event => event.args.to)
            setDidDeposit(deposits.includes(contract))
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
        getAgreedDate();
        getDeadline();
        getClaimEligibility();
    },[])

    //Not only on mount cause it's possible that immediately after deposit you could contest if the agreed upon date is today
    useEffect(() => {
        getContestEligibility();
    },[didDeposit])
    
    return (
        <Container>
            {!didApprove && <Button onClick={handleApprove} isLoading={approvalLoad} loadingText='Approving'>Approve</Button>}
            {(!didDeposit && didApprove) && <Button onClick={handleDeposit} isLoading={depositLoad} loadingText='Depositing'>Deposit</Button>}
            {(!contestEligible && didDeposit) && <Text>The agreed date is {agreedDate.toDateString()}. Please come back to this page on the agreed date to contest the deposit if
            you are the buyer, or 24 hours after the agreed date to claim the deposit as a seller. {
                
            }</Text>}
            {(contestEligible && !didContest) && <Button onClick={handleContestItem}>Contest Item</Button>}
            {(claimEligible && !didClaim) && <Button onClick={handleClaimFunds}>Claim Funds</Button>}
            <Button onClick={getInfo}>Get Info</Button>
        </Container>
    )
}