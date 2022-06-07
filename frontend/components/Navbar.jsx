import { Button, Flex, Heading, HStack, Tag, Text } from '@chakra-ui/react';
import ConnectModal from './connect-modal/ConnectModal';
import { BsSafe2 } from 'react-icons/bs'
import truncateEthAddress from 'truncate-eth-address'

export default function Navbar({accounts, isCorrectChain, isActive, connector}) {
    /*Brief aside on wallet connections. Metamask deactivating doesn't do anything, you have to do it through the metamask ui,
    and Coinbase Wallet has no way to disconnect from the UI as far as I can tell so I built a backend disconnect that will show up
    specifially for that. 
    */
    return (
            <Flex justify='space-between' p='1rem 2rem'>
                <HStack align='center'>
                    <BsSafe2 size='3rem'/>
                    <a href=''><Heading pr='2rem'>SafeDeposit</Heading></a>
                    <Button variant='ghost'>About</Button>
                </HStack>
                <HStack>
                    {(!isCorrectChain && isActive) && <Text as='mark'>Please Connect to Rinkeby Testnet to interact with this DApp</Text>}
                    {isActive ? <Tag size='lg' >{truncateEthAddress(accounts[0])}</Tag> : <ConnectModal />}
                    {connector.coinbaseWallet && <Button onClick={() => connector.deactivate()}>Disconnect</Button>}
                </HStack>
            </Flex>
    )
}