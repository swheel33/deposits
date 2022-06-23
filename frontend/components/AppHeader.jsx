import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Group, Button, Title, ThemeIcon } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons'
import { useMediaQuery } from '@mantine/hooks';

export default function AppHeader({setIsAbout}) {
    
    const smallScreen = useMediaQuery('(max-width: 400px')

    return (
           <Group position='apart'>
                <Group>
                    <ThemeIcon size={smallScreen ? 'sm' : 'xl'} radius='xl'> 
                        <IconShieldLock />
                    </ThemeIcon>
                    <Title>SafeDeposit</Title>
                    <Button onClick={() => setIsAbout(true)}>About</Button>
                </Group>
                <ConnectButton />
           </Group>
           
    )
}