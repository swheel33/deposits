import { ChakraProvider } from '@chakra-ui/react';
import DApp from '../components/DApp';
import Provider from '../components/Provider';

export default function Home() {
  return (
    <div>
      <ChakraProvider>
        <Provider>
          <DApp />
        </Provider>
      </ChakraProvider>
    </div>
  )
}
