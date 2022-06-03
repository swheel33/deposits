import { Tag, Button, Input, Text } from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import truncateEthAddress from 'truncate-eth-address'
import DaiAbi from '../abi/DaiAbi.json'
import DepositFactoryABI from '../contracts/DepositFactory.json'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import DepositInteraction from "./DepositInteraction"
import ContractForm from "./ContractForm"


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
    const depositFactoryAddress = '0x83c61788908494FD106CF41B99CffCB865618a33';

    //ethers signer and contracts
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(daiContractAddress, DaiAbi, signer);
    const depositFactory = new ethers.Contract(depositFactoryAddress, DepositFactoryABI.abi, signer)

    const approvalAmount = 100;

    const depositHandler = async () => {
        const tx = await depositFactory.createDeposit(approvalAmount, 1654193815 , daiContractAddress);
        const receipt = await tx.wait();
        console.log(receipt);
        const emittedAddress = receipt.logs[0].address;
        setNewContract(emittedAddress);
        console.log(`Contract creation successful! Created contract address is: ${emittedAddress}.`)
    }
    
    //Gets all previous contract events created for validation with ContractForm
    const allPrevContracts = async () => {
        const filter = depositFactory.filters.DepositCreated();
        const events = await depositFactory.queryFilter(filter);
        const addresses = events.map(event => event.args[0])
        return addresses;
    }
    
    //Not final implementation but need some way to catch errors with network changing on backend
    useEffect(() => {
        if(!isCorrectChain) {
            alert('Please change networks to the Rinkeby Test Network. Page will reload upon closing this message')
            window.location.reload()
        }
    } , [chainId])

    return (
        <div>
            {isCorrectChain && 
            <div>
                {isActive && <Tag size='lg'>{ENSNames[0] ? ENSNames[0] : truncateEthAddress(accounts[0])}</Tag>}
                {!newContract && <Button onClick={depositHandler}>Create Deposit</Button>}
                {newContract && <Tag>Contract Created: {newContract}</Tag>}
                {newContract && <DepositInteraction 
                                contract={newContract} 
                                tokenAddress={daiContractAddress} 
                                tokenContract={daiContract} 
                                approvalAmount={approvalAmount}
                                signer={signer}/>}
                {!newContract && <ContractForm setNewContract={setNewContract} allPrevContracts={allPrevContracts()}/>}
            </div>}
        
        </div>
        
    )
}