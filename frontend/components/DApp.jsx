import ExistingContractForm from './forms/ExistingContractForm';
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'
import NewContractForm from './forms/NewContractForm';
import { useEffect, useState } from 'react';
import depositFactoryABI from '../contracts/DepositFactory.json'
import DepositContractInstance from './contract-related/DepositContractInstance'
import depositABI from '../contracts/Deposit.json';
import About from './About'
import { useNetwork, useAccount } from 'wagmi';
import { Button, Box, Text, Container, Center, Stack, Group} from '@mantine/core'
import { useViewportSize } from '@mantine/hooks';


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

    return (
       <Container m='0 1rem' >
            <Stack justify='space-between' style={{minHeight: '100vh'}}>
                <AppHeader setIsAbout={setIsAbout}/>
                <Container style={{minHeight: '70vh'}}>
                    {isAbout && <About 
                            setIsAbout={setIsAbout}
                            />}
                    {(!account && !isAbout) && <Text>Please connect your wallet to access this DApp</Text>}
                    {(account && !isCorrectChain && !isAbout) && <Text>Please connect to the Goerli test network to use this app</Text>}
                    {(isCorrectChain && !isAbout) && 
                        <Center>
                                <Stack>
                                    {(!isNewContract && !isExistingContract &&!isAbout) && 
                                        <Text>Welcome to SafeDeposits! <br/> If you've been sent here by
                                            a seller click the "Use Existing Deposit Contract" button and enter the contract
                                            address you were given.
                                        </Text>
                                    }
                                    {(!isNewContract && !isExistingContract && !isAbout) && 
                                    <Group>
                                        <Button onClick={() => setIsNewContract(true)}>Create New Deposit Contract</Button>
                                        <Button onClick={() => setIsExistingContract(true)}>Use Existing Deposit Contract</Button>
                                    </Group>}
                                </Stack>

                                {(!newContractAddress && isCorrectChain && isNewContract && !isAbout) && <NewContractForm 
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
                        </Center>} 
                </Container>
                <AppFooter />
            </Stack>
                
                
                    
            
       </Container> 
    )
}