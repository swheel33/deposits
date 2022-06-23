import { Text, Footer, ThemeIcon, Group } from "@mantine/core";
import { IconBrandGithub } from '@tabler/icons';

export default function AppFooter() {
    return (
            <Footer fluid={true} >
                <Group position="center">
                    <Text>SafeDeposit: A Portfolio Project by Samuel Wheeler</Text>
                    <a href='https://github.com/swheel33/deposits' target='_blank'>
                        <ThemeIcon radius='md'>
                            <IconBrandGithub />
                        </ThemeIcon>
                    </a>
                </Group>
            </Footer>
    )
}