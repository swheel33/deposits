import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Group, Button, Title, ThemeIcon, Anchor, Container } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons'
import { useMediaQuery } from '@mantine/hooks';

export default function AppHeader({setIsAbout}) {
    
    const smallScreen = useMediaQuery('(max-width: 400px')

    return (
           <Container fluid={true} m='1rem 0'>
                <Group position='apart'>
                    <Group>
                        <ThemeIcon size={smallScreen ? 'sm' : 'xl'} radius='xl'> 
                            <IconShieldLock />
                        </ThemeIcon>
                        <Anchor href='' target='' underline={false}><Title>SafeDeposit</Title></Anchor>
                        <Button onClick={() => setIsAbout(true)} sx={(theme) => ({
                            backgroundColor: theme.colors.dark[7]
                        })}>About</Button>
                        </Group>
                    <ConnectButton />
                </Group>
           </Container>
           
           
    )
}