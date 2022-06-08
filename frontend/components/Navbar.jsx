import { Button, Flex, Heading, HStack, VStack, Divider, Tag, Text, Img } from '@chakra-ui/react';
import ConnectModal from './connect-modal/ConnectModal';
import truncateEthAddress from 'truncate-eth-address'

export default function Navbar({accounts, isCorrectChain, isActive, connector, setIsAbout}) {
    
    /*Brief aside on wallet connections. Metamask deactivating doesn't do anything, you have to do it through the metamask ui.
    Some websites have the disconnect buttons for Metamask but honestly I just think it's confusing since its a 
    button that doesn't actually do anything. However for Coinbase Wallet there is no way to disconnect from the UI as far 
    as I can tell (do better Coinbase) so there needs to be a disconnect button for coinbase
    */
    return (
            <Flex position='fixed' w='100%' zIndex='2' backgroundColor='white'>
                <VStack>
                    <Flex w='100%' justify='space-between' p={['0.5rem 1rem', '1rem 2rem']}>
                        <HStack align='center'>
                            <Img src='./safe2.svg' boxSize={['2rem','4rem']}/>
                            <a href=''><Heading pr={[0,'2rem']} size={['xs', 'xl']}>SafeDeposit</Heading></a>
                            <Button variant='ghost' onClick={() => setIsAbout(true)} size={['xs', 'lg']}>About</Button>
                        </HStack>
                        <HStack>
                            {(!isCorrectChain && isActive) && <Text as='mark'>Please Connect to Rinkeby Testnet to interact with this DApp</Text>}
                            {isActive ? <Tag size={['sm','lg']} >{truncateEthAddress(accounts[0])}</Tag> : <ConnectModal />}
                            {connector.coinbaseWallet && <Button onClick={() => connector.deactivate()}>Disconnect</Button>}
                        </HStack>
                    </Flex>
                    <Divider w='100vw' borderColor='black' borderWidth='1'></Divider>
                    
                </VStack>
                
            </Flex>
    )
}