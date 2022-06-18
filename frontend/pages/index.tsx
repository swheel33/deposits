import { ChakraProvider } from '@chakra-ui/react';
import DApp from '../components/DApp';
import Provider from '../components/Provider';
import Head from 'next/head';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  configureChains,
  createClient,
  WagmiConfig,
  defaultChains
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';



export default function Home() {
  const { chains, provider } = configureChains(
    defaultChains,
    [
      alchemyProvider({ alchemyId: process.env.RINKEBY_API_KEY }),
      publicProvider()
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })
  
  return (
    <div>
      <ChakraProvider>
        <Provider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Head>
              <title>SafeDeposit</title>
            </Head>
            <DApp />
          </RainbowKitProvider>
        </WagmiConfig>
        </Provider>
        
      </ChakraProvider>
    </div>
  )
}
