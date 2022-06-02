import { Tag, Button } from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import truncateEthAddress from 'truncate-eth-address'
import DaiAbi from '../abi/DaiAbi.json'
import DepositFactoryABI from '../contracts/DepositFactory.json'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'


export default function DApp({chainId, accounts, error, isActivating, isActive, provider, ENSNames} : {
    chainId: number,
    accounts: string[],
    error: Error,
    isActivating: boolean,
    isActive: boolean,
    provider: Web3Provider,
    ENSNames: string[]
}) {
    const [newContract, setNewContract] = useState('');
    //Contract Addresses
    const daiContractAddress = '0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C';
    const depositFactoryAddress = '0xEf58478CD1d71940b44614196dF2A82f5fED4207';

    //ethers signer and contracts
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(daiContractAddress, DaiAbi, signer);
    const depositFactory = new ethers.Contract(depositFactoryAddress, DepositFactoryABI.abi, signer)

    const depositHandler = async () => {
       await depositFactory.createDeposit(100, 1654193815 , daiContractAddress)
       provider.once("block", () => {
        depositFactory.on('DepositCreated', address => setNewContract(address))
       })
    }

    useEffect(() => {
        console.log(`Your contract address is ${newContract}`);
    }, [newContract])

    return (
        <div>
            {isActive && <Tag size='lg'>{ENSNames[0] ? ENSNames[0] : truncateEthAddress(accounts[0])}</Tag>}
            <Button onClick={depositHandler}>Create Deposit</Button>
        </div>
    )
}