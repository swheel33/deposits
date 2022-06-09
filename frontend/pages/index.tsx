import { ChakraProvider } from '@chakra-ui/react';
import DApp from '../components/DApp';
import Provider from '../components/Provider';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <ChakraProvider>
        <Provider>
          <Head>
            <title>SafeDeposit</title>
          </Head>
          <DApp />
        </Provider>
      </ChakraProvider>
    </div>
  )
}
