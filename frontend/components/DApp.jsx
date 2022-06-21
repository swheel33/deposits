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
import depositFactoryABI from '../contracts/DepositFactory.json'
import DepositContractInstance from './contract-related/DepositContractInstance'
import depositABI from '../contracts/Deposit.json';
import { useWeb3React } from '@web3-react/core';
import About from './About'
import { useNetwork, useAccount, useEnsName, useContractRead, useContract } from 'wagmi';

export default function DApp() {
    //const { chainId, accounts, isActive, provider, ENSNames, connector } = useWeb3React();
    
    const { activeChain } = useNetwork();
    const { data: account } = useAccount();
    //const { data: ensName } = useEnsName({ address: account.address });

    //About section handling
    const [isAbout, setIsAbout] = useState();
    
    //Correct Chain check
    const [isCorrectChain, setIsCorrectChain] = useState(false);

    useEffect(() => {
        if (activeChain) {
            setIsCorrectChain(activeChain.name === 'Rinkeby')
        }
    },[activeChain])
    

    //Defining address of the contract that will get created when starting the deposit sequence
    const [newContractAddress, setNewContractAddress] = useState('');
    
    //Deposited token choice
    const daiContractAddress = '0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C';
    const usdcContractAddress = '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926';
    const tetherContractAddress = '0xc66227E44bf1E6F043919A65707b826e3E9f1132';
    const [chosenTokenContract, setChosenTokenContract] = useState();
    const [chosenToken, setChosenToken] = useState();
  
    //Contract Addresses
    const depositFactoryAddress = '0xAEA66E013CDA1e8675eA757cD9ADDA4b466578Dd';

    //State variables for page navigation
    const [isNewContract, setIsNewContract] = useState(false);
    const [isExistingContract, setIsExistingContract] = useState(false)
    const [newlyCreated, setNewlyCreated] = useState(false);
    
    //ethers signer and contracts
    const [signer, setSigner] = useState();
    //const [depositFactoryContract, setDepositFactoryContract] = useState();
    const [newDepositContract, setNewDepositContract] = useState();


    /*useEffect(() => {
        if(provider) {
            setSigner(provider.getSigner());
        }
    }, [provider])*/

    const [daiTokenContract, setDaiTokenContract] = useState();
    const [USDCTokenContract, setUSDCTokenContract] = useState();
    const [tetherTokenContract, setTetherTokenContract] = useState();
    
    /* useEffect(() => {
        if(signer) {
            setDepositFactoryContract(new ethers.Contract(depositFactoryAddress, DepositFactoryABI.abi, signer));
            setDaiTokenContract(new ethers.Contract(daiContractAddress, DaiAbi, signer));
            setUSDCTokenContract(new ethers.Contract(usdcContractAddress, USDCAbi, signer));
            setTetherTokenContract(new ethers.Contract(tetherContractAddress, TetherAbi, signer));
        }
    }, [signer]) */

    useEffect(() => {
        if (chosenToken === 'Dai') {
            setChosenTokenContract(daiTokenContract)
        } else if (chosenToken === 'USDC') {
            setChosenTokenContract(USDCTokenContract)
        } else if (chosenToken === 'Tether') {
            setChosenTokenContract(tetherTokenContract)
        }
    }, [chosenToken])

    /* useEffect(() => {
        if(newContractAddress) {
            setNewDepositContract(new ethers.Contract(newContractAddress, DepositABI.abi, signer))
        }
    }, [newContractAddress]) */


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
                {(account && !isCorrectChain && !isAbout) && <Center><Text fontSize={['xl','3xl']}>Please connect to the Rinkeby test network to use this app</Text></Center>}
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
                                                                    setChosenToken={setChosenToken}
                                                                    daiContractAddress={daiContractAddress}
                                                                    usdcContractAddress={usdcContractAddress}
                                                                    tetherContractAddress={tetherContractAddress}
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
                                                            tokenContract={chosenTokenContract}
                                                            daiContractAddress={daiContractAddress}
                                                            usdcContractAddress={usdcContractAddress}
                                                            tetherContractAddress={tetherContractAddress}
                                                            chosenToken={chosenToken}
                                                            setChosenToken={setChosenToken}
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