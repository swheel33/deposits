import { Box, Divider, Flex, Link, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <Box pos='fixed' w='100%' bottom='0' pb='0.5rem' zIndex='2' backgroundColor='white'>
            <Flex justify='center' align='center' direction='column'>
                <Divider borderColor='black' borderWidth='1'></Divider>
                <Flex pt='0.5rem' align='center'>
                    <Text fontSize={['xs', 'lg']}>SafeDeposit: A Portfolio Project by Samuel Wheeler</Text>
                    <Link isExternal href='https://github.com/swheel33/deposits' ml='1rem'>
                        <FaGithub />
                    </Link>
                </Flex>
                
            </Flex>
        </Box>
    )
}