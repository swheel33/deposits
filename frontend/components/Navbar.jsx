import { Button, Flex, Heading, HStack, Tag, Text } from '@chakra-ui/react';
import ConnectModal from './connect-modal/ConnectModal';
import { BsSafe2 } from 'react-icons/bs'
import truncateEthAddress from 'truncate-eth-address'

export default function Navbar({accounts, isCorrectChain, isActive, connector, setIsAbout}) {
    
    /*Brief aside on wallet connections. Metamask deactivating doesn't do anything, you have to do it through the metamask ui.
    Some websites have the disconnect buttons for Metamask but honestly I just think it's confusing since its a 
    button that doesn't actually do anything. However for Coinbase Wallet there is no way to disconnect from the UI as far 
    as I can tell (do better Coinbase) so there needs to be a disconnect button for coinbase
    */
    return (
            <Flex justify='space-between' p='1rem 2rem'>
                <HStack align='center'>
                    <BsSafe2 size='3rem'/>
                    <a href=''><Heading pr='2rem'>SafeDeposit</Heading></a>
                    <Button variant='ghost' onClick={() => setIsAbout(true)}>About</Button>
                </HStack>
                <HStack>
                    {(!isCorrectChain && isActive) && <Text as='mark'>Please Connect to Rinkeby Testnet to interact with this DApp</Text>}
                    {isActive ? <Tag size='lg' >{truncateEthAddress(accounts[0])}</Tag> : <ConnectModal />}
                    {connector.coinbaseWallet && <Button onClick={() => connector.deactivate()}>Disconnect</Button>}
                </HStack>
            </Flex>
    )
}