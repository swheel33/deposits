import { Box, Flex, Button, Center, Text } from '@chakra-ui/react'
import ExistingContractForm from './forms/ExistingContractForm';
import Navbar from './Navbar'
import Footer from './Footer'
import NewContractForm from './forms/NewContractForm';
import { useEffect, useState } from 'react';
import depositFactoryABI from '../contracts/DepositFactory.json'
import DepositContractInstance from './contract-related/DepositContractInstance'
import depositABI from '../contracts/Deposit.json';
import About from './About'
import { useNetwork, useAccount, useEnsName, useContractRead, useContract } from 'wagmi';

export default function DApp() {
    
    const { activeChain } = useNetwork();
    const { data: account } = useAccount();

    //About section handling
    const [isAbout, setIsAbout] = useState();
    
    //Correct Chain check
    const [isCorrectChain, setIsCorrectChain] = useState(false);

    useEffect(() => {
        if (activeChain) {
            setIsCorrectChain(activeChain.name === 'Goerli')
        }
    },[activeChain])
    
    //Defining address of the contract that will get created when starting the deposit sequence
    const [newContractAddress, setNewContractAddress] = useState('');
  
    //Contract Addresses
    const depositFactoryAddress = '0x787662aa7847533E04516Db00D31933b14A1D195';
    const usdcContractAddress = '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C';
    const daiContractAddress = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60';

    //State variables for page navigation
    const [isNewContract, setIsNewContract] = useState(false);
    const [isExistingContract, setIsExistingContract] = useState(false)
    const [newlyCreated, setNewlyCreated] = useState(false);



    const [daiTokenContract, setDaiTokenContract] = useState();
    const [USDCTokenContract, setUSDCTokenContract] = useState();
    const [tetherTokenContract, setTetherTokenContract] = useState();


    return (
       
        <Box h='100vh' w='100vw'>
            <Navbar 
                isCorrectChain={isCorrectChain}
                setIsAbout={setIsAbout}/>
            <Box p='0 1rem' pos='relative' top={['5rem','8rem']}>
                <Box h='200%'>
                    {isAbout && <About 
                            setIsAbout={setIsAbout}
                            daiTokenContract={daiTokenContract}
                            USDCTokenContract={USDCTokenContract}
                            tetherTokenContract={tetherTokenContract}
                            account={account}
                            isCorrectChain={isCorrectChain}
                            />}
                </Box>
                {(!account && !isAbout) && <Center><Text fontSize={['xl','3xl']}>Please connect your wallet to access this DApp</Text></Center>}
                {(account && !isCorrectChain && !isAbout) && <Center><Text fontSize={['xl','3xl']}>Please connect to the Goerli test network to use this app</Text></Center>}
                {(isCorrectChain && !isAbout) && <Flex h='80%' align='center' direction='column'>
                    {(!isNewContract && !isExistingContract &&!isAbout) && <Flex>
                        <Text>Welcome to SafeDeposits! <br/> If you've been sent here by
                            a seller click the "Use Existing Deposit Contract" button and enter the contract
                            address you were given.
                        </Text>
                    </Flex> }
                    {(!isNewContract && !isExistingContract && !isAbout) && <Flex h='20%' w='100%' align='center' justify='space-evenly' direction={['column', 'row']}>
                        <Button onClick={() => setIsNewContract(true)} m='1rem'>Create New Deposit Contract</Button>
                        <Button onClick={() => setIsExistingContract(true)}>Use Existing Deposit Contract</Button>
                    </Flex>}
                    {(!newContractAddress && isNewContract && !isAbout) && <NewContractForm 
                                                                    depositFactoryAddress={depositFactoryAddress}
                                                                    depositFactoryABI={depositFactoryABI.abi}
                                                                    usdcContractAddress={usdcContractAddress}
                                                                    daiContractAddress={daiContractAddress}
                                                                    account={account} 
                                                                    setNewContractAddress={setNewContractAddress}
                                                                    setIsExistingContract={setIsExistingContract}
                                                                    setIsNewContract={setIsNewContract}
                                                                    setNewlyCreated={setNewlyCreated}/>}
                    {(!newContractAddress && isExistingContract && !isAbout) && <ExistingContractForm 
                                                                        depositFactoryAddress={depositFactoryAddress} 
                                                                        depositFactoryABI={depositFactoryABI.abi}
                                                                        setNewContractAddress={setNewContractAddress}
                                                                        setIsExistingContract={setIsExistingContract}
                                                                        setIsNewContract={setIsNewContract}
                                                                        />}
                    {(newContractAddress && !isAbout) && <DepositContractInstance 
                                                            depositContractAddress={newContractAddress}
                                                            depositContractABI={depositABI.abi}
                                                            account={account}
                                                            newlyCreated={newlyCreated}/>}
                </Flex>} 
            </Box>
            <Footer />
        </Box> 
       
        
        
    )
}