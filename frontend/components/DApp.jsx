import { Box, Flex, Button, Grid, GridItem, Text } from '@chakra-ui/react'
import { useBoolean } from '@chakra-ui/react'
import ExistingContractForm from './forms/ExistingContractForm';
import Navbar from './Navbar'
import NewContractForm from './forms/NewContractForm';
import { useEffect, useState } from 'react';
import { ethers } from "ethers"
import DaiAbi from '../abi/DaiAbi.json'
import DepositFactoryABI from '../contracts/DepositFactory.json'
import ContractInstance from './contract-interaction/ContractInstance'
import DepositABI from '../contracts/Deposit.json';

export default function DApp({chainId, accounts, error, isActivating, isActive, provider, ENSNames}) {
    //Correct Chain check
    const isCorrectChain = chainId === 4;

    //Defining address of the contract that will get created when starting the deposit sequence
    const [newContractAddress, setNewContractAddress] = useState('');
 
    //Contract Addresses
    const daiContractAddress = '0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C';
    const depositFactoryAddress = '0x68EC9875093f5B851715c5F68837509491569f26';

    //ethers signer and contracts
    const [signer, setSigner] = useState();
    const [daiContract, setDaiContract] = useState();
    const [depositFactoryContract, setDepositFactoryContract] = useState();
    const [newDepositContract, setNewDepositContract] = useState();


    const [isNewContract, setIsNewContract] = useBoolean();
    const [isExistingContract, setIsExistingContract] = useBoolean()

    useEffect(() => {
        if(provider) {
            setSigner(provider.getSigner());
        }
    }, [provider])

    useEffect(() => {
        if(signer) {
            setDaiContract(new ethers.Contract(daiContractAddress, DaiAbi, signer));
            setDepositFactoryContract(new ethers.Contract(depositFactoryAddress, DepositFactoryABI.abi, signer));
        }
    }, [signer])

    useEffect(() => {
        if(newContractAddress) {
            setNewDepositContract(new ethers.Contract(newContractAddress, DepositABI.abi, signer))
        }
    }, [newContractAddress])

    

    return (
        <Box h='100vh'>
            <Navbar accounts={accounts} isActive={isActive} ENSNames={ENSNames} isCorrectChain={isCorrectChain}/>
            {isCorrectChain && <Flex h='80%' align='center' direction='column'>
                {(!isNewContract && !isExistingContract) && <Flex>
                    <Text>Welcome to SafeDeposits! <br/> If you've been sent here by
                        a seller, after connecting to your wallet, click the "Use Existing Deposit Contract" button and enter the contract
                        address you were given.
                    </Text>
                </Flex> }
                {(isActive && !isNewContract && !isExistingContract) && <Flex h='20%' w='100%' align='center' justify='space-evenly'>
                    <Button onClick={setIsNewContract.on}>Create New Deposit Contract</Button>
                    <Button onClick={setIsExistingContract.on}>Use Existing Deposit Contract</Button>
                </Flex>}
                {(!newContractAddress && isNewContract) && <NewContractForm daiContractAddress={daiContractAddress} 
                                                    depositFactoryContract={depositFactoryContract} 
                                                    accounts={accounts} 
                                                    provider={provider}
                                                    setNewContractAddress={setNewContractAddress}/>}
                {(!newContractAddress && isExistingContract) && <ExistingContractForm depositFactoryContract={depositFactoryContract} setNewContractAddress={setNewContractAddress}/>}
                {newDepositContract && <ContractInstance depositContract={newDepositContract}
                                                        tokenContract={daiContract} 
                                                        depositContractAddress={newContractAddress}
                                                        accounts={accounts}/>}
            </Flex>}
        </Box>
        
    )
}