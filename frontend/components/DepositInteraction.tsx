import { Button, Container } from "@chakra-ui/react";
import { JsonRpcSigner } from "@ethersproject/providers";
import { BigNumber, Contract, ethers } from "ethers";
import { useState } from "react";
import DepositAbi from '../contracts/Deposit.json';


export default function DepositInteraction({contract, tokenAddress, tokenContract, approvalAmount, signer} : 
    {contract: string, tokenAddress: string, tokenContract: Contract, approvalAmount: number, signer: JsonRpcSigner}) {
    
    const [didDeposit, setDidDeposit] = useState(false);
    const [didApprove, setDidApprove] = useState(false);

    const depositContract = new ethers.Contract(contract, DepositAbi.abi, signer)
    
    const handleApprove = async () => {
        const tx = await tokenContract.approve(contract, approvalAmount);
        await tx.wait();
        setDidApprove(true);
        console.log('Successful Approval!');
    }
        

    const handleDeposit = async () => {
        const tx = await depositContract.confirmDeposit();
        await tx.wait();
        setDidDeposit(true);
        console.log('Successful Deposit!');
    }

    const depositValueHandler = async () => {
        const tx = await depositContract.getContractValue();
        const receipt = await tx.wait();
        console.log(BigNumber.from(receipt.logs[0].data).toString());
    }

    const contractTokenValueHandler = async () => {
        const tx = await depositContract.contractTokens();
        const receipt = await tx.wait();
        console.log(BigNumber.from(receipt.logs[0].data).toString());
    }
    
    return (
        <Container>
            {!didApprove && <Button onClick={handleApprove}>Approve</Button>}
            {(!didDeposit && didApprove) && <Button onClick={handleDeposit}>Deposit</Button>}
            <Button onClick={depositValueHandler}>Get Deposit Value</Button>
            <Button onClick={contractTokenValueHandler}>Get Contract Token Value</Button>
        </Container>
    )
}