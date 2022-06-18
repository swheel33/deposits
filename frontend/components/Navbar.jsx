import { Button, Flex, Heading, HStack, VStack, Divider, Tag, Text, Img } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar({isCorrectChain, setIsAbout, activeChain}) {
    

    return (
            <Flex position='fixed' w='100%' zIndex='2' backgroundColor='white'>
                <VStack>
                    <Flex w='100%' justify='space-between' p={['0.5rem 1rem', '0.5rem 2rem']}>
                        <HStack align='center'>
                            <Img src='./safe2.svg' boxSize={['2rem','4rem']}/>
                            <a href=''><Heading pr={[0,'2rem']} size={['sm', 'xl']}>SafeDeposit</Heading></a>
                            <Button variant='ghost' onClick={() => setIsAbout(true)} size={['sm', 'lg']}>About</Button>
                        </HStack>
                        <HStack>
                            {(activeChain && !isCorrectChain) && <Text as='mark'>Please Connect to Rinkeby Testnet to interact with this DApp</Text>}
                            <ConnectButton />
                        </HStack>
                    </Flex>
                    <Divider w='100vw' borderColor='black' borderWidth='1'></Divider>
                    
                </VStack>
                
            </Flex>
    )
}