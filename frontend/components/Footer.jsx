import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <Box pos='fixed' w='100%' bottom='2rem'>
            <Flex justify='center' align='center'>
                <Text>SafeDeposit: A Portfolio Project by Samuel Wheeler</Text>
                <Link isExternal href='https://github.com/swheel33/deposits' ml='1rem'>
                    <FaGithub />
                </Link>
            </Flex>
        </Box>
    )
}