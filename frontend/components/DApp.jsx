import { Box, Flex, Button, Center, Text } from '@chakra-ui/react'
import ExistingContractForm from './forms/ExistingContractForm';
import Navbar from './Navbar'
import Footer from './Footer'
import NewContractForm from './forms/NewContractForm';
import { useEffect, useState } from 'react';
import { ethers } from "ethers"
import DaiAbi from '../abi/DaiAbi.json'
import DepositFactoryABI from '../contracts/DepositFactory.json'
import ContractInstance from './contract-related/ContractInstance'
import DepositABI from '../contracts/Deposit.json';
import { useWeb3React } from '@web3-react/core';

export default function DApp() {
    const { chainId, accounts, isActive, account, provider, ENSNames, connector } = useWeb3React();
    
    //Correct Chain check
    const [isCorrectChain, setIsCorrectChain] = useState(false);

    useEffect(() => {
        setIsCorrectChain(chainId === 4)
    },[chainId])

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


    const [isNewContract, setIsNewContract] = useState(false);
    const [isExistingContract, setIsExistingContract] = useState(false)
    const [newlyCreated, setNewlyCreated] = useState(false);


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
            <Navbar accounts={accounts} isActive={isActive} isCorrectChain={isCorrectChain} connector={connector}/>
            {!isActive && <Center><Text fontSize='2xl'>Please connect your wallet to access this DApp</Text></Center>}
            {(isCorrectChain && isActive) && <Flex h='80%' align='center' direction='column'>
                {(!isNewContract && !isExistingContract) && <Flex>
                    <Text>Welcome to SafeDeposits! <br/> If you've been sent here by
                        a seller click the "Use Existing Deposit Contract" button and enter the contract
                        address you were given.
                    </Text>
                </Flex> }
                {(isActive && !isNewContract && !isExistingContract) && <Flex h='20%' w='100%' align='center' justify='space-evenly'>
                    <Button onClick={() => setIsNewContract(true)}>Create New Deposit Contract</Button>
                    <Button onClick={() => setIsExistingContract(true)}>Use Existing Deposit Contract</Button>
                </Flex>}
                {(!newContractAddress && isNewContract) && <NewContractForm 
                                                                daiContractAddress={daiContractAddress} 
                                                                depositFactoryContract={depositFactoryContract} 
                                                                accounts={accounts} 
                                                                provider={provider}
                                                                setNewContractAddress={setNewContractAddress}
                                                                setIsExistingContract={setIsExistingContract}
                                                                setIsNewContract={setIsNewContract}
                                                                setNewlyCreated={setNewlyCreated}/>}
                {(!newContractAddress && isExistingContract) && <ExistingContractForm 
                                                                    depositFactoryContract={depositFactoryContract} 
                                                                    setNewContractAddress={setNewContractAddress}
                                                                    setIsExistingContract={setIsExistingContract}
                                                                    setIsNewContract={setIsNewContract}
                                                                    />}
                {newDepositContract && <ContractInstance depositContract={newDepositContract}
                                                        tokenContract={daiContract} 
                                                        depositContractAddress={newContractAddress}
                                                        accounts={accounts}
                                                        newlyCreated={newlyCreated}/>}
            </Flex>}
            <Footer />
        </Box>
        
    )
}