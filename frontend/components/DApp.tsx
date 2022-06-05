import { Tag, Button, Input, Text } from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import truncateEthAddress from 'truncate-eth-address'
import DaiAbi from '../abi/DaiAbi.json'
import DepositFactoryABI from '../contracts/DepositFactory.json'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import DepositInteraction from "./DepositInteraction"
import ExistingContractForm from "./ExistingContractForm"
import NewContractForm from "./NewContractForm"


export default function DApp({chainId, accounts, error, isActivating, isActive, provider, ENSNames} : {
    chainId: number,
    accounts: string[],
    error: Error,
    isActivating: boolean,
    isActive: boolean,
    provider: Web3Provider,
    ENSNames: string[]
}) {
    //Correct chain check
    const isCorrectChain = chainId === 4;

    //Defining address of the contract that will get created when starting the deposit sequence
    const [newContract, setNewContract] = useState('');
 
    //Contract Addresses
    const daiContractAddress = '0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C';
    const depositFactoryAddress = '0x68EC9875093f5B851715c5F68837509491569f26';

    //ethers signer and contracts
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(daiContractAddress, DaiAbi, signer);
    const depositFactory = new ethers.Contract(depositFactoryAddress, DepositFactoryABI.abi, signer)

     //Controlled input for deposit contract
     const [approvalAmount, setApprovalAmount] = useState(0);
     const [meetupDate, setMeetupDate] = useState(0);

     const depositHandler = async () => {
        try {
            const tx = await depositFactory.createDeposit(approvalAmount, meetupDate , daiContractAddress, accounts[0]);
            const receipt = await tx.wait();
            const emittedAddress = receipt.logs[0].address;
            setNewContract(emittedAddress);
            console.log(`Contract creation successful! Created contract address is: ${emittedAddress}. Deposit amount is ${approvalAmount} and the agreed date is ${meetupDate}.`);
        } catch (error) {
            console.log(error);
        }
    }
    
    //Gets all previous contract events created for validation with ContractForm
    const allPrevContracts = async () => {
        const filter = depositFactory.filters.DepositCreated();
        const events = await depositFactory.queryFilter(filter);
        const addresses = events.map(event => event.args[0])
        return addresses;
    }
    
    //Not the prettiest but need some way of handling changing networks breaking the app
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const handleWrongNetwork = async () => {
        await delay(5000);
        window.location.reload();
    }
    
    useEffect(() => {
        if (!isCorrectChain) {
            handleWrongNetwork()
        }
    } , [chainId])

    /* There was an odd interaction where if I call the depositHandler in the submit handling of
     the form the values would be one submission behind so now it's being handled here. This works since you will only submit once */
    useEffect(() => {
        if(approvalAmount != 0) {
            depositHandler()
        }
    },[approvalAmount, meetupDate])



    return (
        <div>
            {isCorrectChain && 
            <div>
                {isActive && <Tag size='lg'>{ENSNames[0] ? ENSNames[0] : truncateEthAddress(accounts[0])}</Tag>}
                {newContract && <Tag>Contract Created: {newContract}</Tag>}
                {newContract && <DepositInteraction 
                                contract={newContract} 
                                tokenContract={daiContract} 
                                approvalAmount={approvalAmount}
                                signer={signer}
                                accounts={accounts}/>}
                {!newContract && <ExistingContractForm setNewContract={setNewContract} allPrevContracts={allPrevContracts()}/>}
                {!newContract && <NewContractForm setApprovalAmount={setApprovalAmount} setMeetupDate={setMeetupDate} />}
            </div>}
            {!isCorrectChain && <Text>Please Connect to the Rinkeby Testnet. Page will reload in 5 seconds</Text>}
        </div>
        
    )
}