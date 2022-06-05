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


    const depositContract = new ethers.Contract(contract, DepositAbi.abi, signer)
    
    const handleApprove = async () => {
        try {
            const tx = await tokenContract.approve(contract, approvalAmount);
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

    const getContestEligibility = async () => {
        try {
            if (didDeposit) {
                const agreedDateUnix = await depositContract.getAgreedDate();
                const deadlineUnix = await depositContract.getDeadline();
                const agreedDate = new Date(agreedDateUnix * 1000);
                const deadline = new Date(deadlineUnix * 1000);
                const now = new Date();
                setContestEligible(now > agreedDate && now < deadline);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getClaimEligibility = async () => {
        try {
            if(!didContest) {
                const deadlineUnix = await depositContract.getDeadline();
                const deadline = new Date(deadlineUnix * 1000);
                const now = new Date();
                setClaimEligible(now > deadline);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getApprovalStatus()
    },[didApprove])

    useEffect(() => {
        getDepositStatus()
    },[didDeposit])

    useEffect(() => {
        getContestStatus()
    },[didContest])

    useEffect(() => {
        getClaimStatus()
    },[didClaim])

    //Not only on mount cause it's possible that immediately after deposit you could contest if the agreed upon date is today
    useEffect(() => {
        getContestEligibility();
    },[didDeposit])

    useEffect(() => {
        getClaimEligibility(); 
    },[])
    
    return (
        <Container>
            {!didApprove && <Button onClick={handleApprove}>Approve</Button>}
            {(!didDeposit && didApprove) && <Button onClick={handleDeposit}>Deposit</Button>}
            {(contestEligible && !didContest) && <Button onClick={handleContestItem}>Contest Item</Button>}
            {(claimEligible && !didClaim) && <Button onClick={handleClaimFunds}>Claim Funds</Button>}
            <Button onClick={getInfo}>Get Info</Button>
        </Container>
    )
}