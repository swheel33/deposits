import { Button, Flex, Heading, HStack, Tag, Text } from '@chakra-ui/react';
import ConnectModal from './connect-modal/ConnectModal';
import { BsSafe2 } from 'react-icons/bs'
import truncateEthAddress from 'truncate-eth-address'
import { useEffect } from 'react';

export default function Navbar({accounts, ENSNames, isCorrectChain, isActive}) {

    return (
            <Flex justify='space-between' p='1rem 2rem'>
                <HStack align='center'>
                    <a href=''><BsSafe2 size='3rem'/></a>
                    <a href=''><Heading pr='2rem'>SafeDeposit</Heading></a>
                    <Button variant='ghost'>About</Button>
                </HStack>
                <HStack>
                    {(!isCorrectChain && isActive) && <Text as='mark'>Please Connect to Rinkeby Testnet to interact with this DApp</Text>}
                    {isActive ? <Tag size='lg'>{ENSNames[0] ? ENSNames[0] : truncateEthAddress(accounts[0])}</Tag> : <ConnectModal />}
                </HStack>
            </Flex>
    )
}