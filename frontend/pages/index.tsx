import Provider from '../components/Provider'
import { ChakraProvider } from '@chakra-ui/react';
import ConnectorHandler from '../components/ConnectorHandler';

export default function Home() {
  return (
    <div>
      <Provider />
      <ChakraProvider>
        <ConnectorHandler />
      </ChakraProvider>
    </div>
  )
}
