import { hooks as metamaskHooks } from '../connectors/metaMask'
import { hooks as coinbaseWalletHooks } from '../connectors/coinbaseWallet'
import { hooks as walletConnectHooks } from '../connectors/walletConnect'
import { useEffect, useState } from 'react';
import DApp from './DApp'

//If anyone reads this please let me know a cleaner way to implement getting info from the connectors
export default function ConnectorHandler() {
    const { useChainId: useChainIdMM, useAccounts: useAccountsMM, useError: useErrorMM, useIsActivating: useIsActivatingMM,
         useIsActive: useIsActiveMM, useProvider: useProviderMM, useENSNames: useENSNamesMM } = metamaskHooks;

    const { useChainId: useChainIdCB, useAccounts: useAccountsCB, useError: useErrorCB, useIsActivating: useIsActivatingCB,
        useIsActive: useIsActiveCB, useProvider: useProviderCB, useENSNames: useENSNamesCB } = coinbaseWalletHooks;

    const { useChainId: useChainIdWC, useAccounts: useAccountsWC, useError: useErrorWC, useIsActivating: useIsActivatingWC,
        useIsActive: useIsActiveWC, useProvider: useProviderWC, useENSNames: useENSNamesWC } = walletConnectHooks;

    const chainIdMM = useChainIdMM();
    const accountsMM = useAccountsMM();
    const errorMM = useErrorMM();
    const isActivatingMM = useIsActivatingMM();
    const isActiveMM = useIsActiveMM();
    const providerMM = useProviderMM();
    const ENSNamesMM = useENSNamesMM(providerMM);

    const chainIdCB = useChainIdCB();
    const accountsCB = useAccountsCB();
    const errorCB = useErrorCB();
    const isActivatingCB = useIsActivatingCB();
    const isActiveCB = useIsActiveCB();
    const providerCB = useProviderCB();
    const ENSNamesCB = useENSNamesCB(providerCB);

    const chainIdWC = useChainIdWC();
    const accountsWC = useAccountsWC();
    const errorWC = useErrorWC();
    const isActivatingWC = useIsActivatingWC();
    const isActiveWC = useIsActiveWC();
    const providerWC = useProviderWC();
    const ENSNamesWC = useENSNamesWC(providerWC);

    const [chainId, setChainId] = useState();
    const [accounts, setAccounts] = useState();
    const [error, setError] = useState();
    const [isActivating, setIsActivating] = useState();
    const [isActive, setIsActive] = useState();
    const [provider, setProvider] = useState();
    const [ENSNames, setENSNames] = useState([]);
    
    useEffect(() => {
        if (isActiveMM) {
            setChainId(chainIdMM);
            setAccounts(accountsMM);
            setError(errorMM);
            setIsActivating(isActivatingMM);
            setIsActive(isActiveMM);
            setProvider(providerMM);
            setENSNames(ENSNamesMM);
        } else if (isActiveCB) {
            setChainId(chainIdCB);
            setAccounts(accountsCB);
            setError(errorCB);
            setIsActivating(isActivatingCB);
            setIsActive(isActiveCB);
            setProvider(providerCB);
        } else if (isActiveWC) {
            setChainId(chainIdWC);
            setAccounts(accountsWC);
            setError(errorWC);
            setIsActivating(isActivatingWC);
            setIsActive(isActiveWC);
            setProvider(providerWC);
        } else {
            setChainId(0);
            setAccounts([]);
            setIsActive(false);
            setIsActivating(false);
            setProvider(undefined);
            setError(undefined);
        }
    },[isActiveMM, isActiveCB, isActiveWC, ENSNamesMM, ENSNamesCB, ENSNamesWC])
    
    

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