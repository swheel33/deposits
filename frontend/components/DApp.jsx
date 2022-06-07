import { Box, Flex, Button, Center, Text } from '@chakra-ui/react'
import ExistingContractForm from './forms/ExistingContractForm';
import Navbar from './Navbar'
import Footer from './Footer'
import NewContractForm from './forms/NewContractForm';
import { useEffect, useState } from 'react';
import { ethers } from "ethers"
import DaiAbi from '../abi/DaiAbi.json'
import TetherAbi from '../abi/TetherAbi.json';
import USDCAbi from '../abi/USDCAbi.json';
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
    
    //Deposited token choice
    const daiContractAddress = '0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C';
    const usdcContractAddress = '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926';
    const tetherContractAddress = '0xc66227E44bf1E6F043919A65707b826e3E9f1132';
    const [chosenTokenAddress, setChosenTokenAddress] = useState();
    const [chosenTokenABI, setChosenTokenABI] = useState();
  
    //Contract Addresses
    
    const depositFactoryAddress = '0xAEA66E013CDA1e8675eA757cD9ADDA4b466578Dd';

    //State variables for page navigation
    const [isNewContract, setIsNewContract] = useState(false);
    const [isExistingContract, setIsExistingContract] = useState(false)
    const [newlyCreated, setNewlyCreated] = useState(false);
    
    //ethers signer and contracts
    const [signer, setSigner] = useState();
    const [tokenContract, setTokenContract] = useState();
    const [depositFactoryContract, setDepositFactoryContract] = useState();
    const [newDepositContract, setNewDepositContract] = useState();

    useEffect(() => {
        if(provider) {
            setSigner(provider.getSigner());
        }
    }, [provider])

    useEffect(() => {
        if(signer) {
            setDepositFactoryContract(new ethers.Contract(depositFactoryAddress, DepositFactoryABI.abi, signer));
        }
    }, [signer])

    useEffect(() => {
        if (chosenTokenAddress===daiContractAddress) {
            setChosenTokenABI(DaiAbi)
        } else if (chosenTokenAddress===usdcContractAddress) {
            setChosenTokenABI(USDCAbi)
        } else if (chosenTokenAddress===tetherContractAddress) {
            setChosenTokenABI(TetherAbi)
        }
    }, [chosenTokenAddress])
    
    useEffect(() => {
        if(signer && chosenTokenAddress && chosenTokenABI) {
            setTokenContract(new ethers.Contract(chosenTokenAddress, chosenTokenABI, signer));
        }
    },[chosenTokenABI])

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
                                                                setChosenTokenAddress={setChosenTokenAddress}
                                                                daiContractAddress={daiContractAddress}
                                                                usdcContractAddress={usdcContractAddress}
                                                                tetherContractAddress={tetherContractAddress}
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
                                                        tokenContract={tokenContract}
                                                        daiContractAddress={daiContractAddress}
                                                        usdcContractAddress={usdcContractAddress}
                                                        tetherContractAddress={tetherContractAddress}
                                                        chosenTokenAddress={chosenTokenAddress}
                                                        setChosenTokenAddress={setChosenTokenAddress} 
                                                        depositContractAddress={newContractAddress}
                                                        accounts={accounts}
                                                        newlyCreated={newlyCreated}/>}
            </Flex>}
            <Footer />
        </Box>
        
    )
}