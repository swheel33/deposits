import { hooks } from '../connectors/metaMask'
import DApp from './DApp';


export default function MetamaskDApp() {
    const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;

    const chainId = useChainId()
    const accounts = useAccounts()
    const error = useError()
    const isActivating = useIsActivating()
    const isActive = useIsActive()
    const provider = useProvider()
    const ENSNames = useENSNames(provider)

    provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload();
        }
    })

    return (
         <DApp 
        chainId={chainId}
        accounts={accounts}
        error={error}
        isActivating={isActivating}
        isActive={isActive}
        provider={provider}
        ENSNames={ENSNames}/> 
    )
}