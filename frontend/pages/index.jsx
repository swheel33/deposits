import DApp from '../components/DApp';
import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
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
      alchemyProvider({ alchemyId: process.env.GOERLI_API_KEY }),
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
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>
            <DApp />
          </RainbowKitProvider>
        </WagmiConfig>
    </div>
  )
}
