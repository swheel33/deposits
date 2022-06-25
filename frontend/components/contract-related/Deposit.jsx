import { Button, Anchor, ThemeIcon } from '@mantine/core';
import { useContractWrite, useWaitForTransaction } from "wagmi";
import depositABI from '../../contracts/Deposit.json'
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons';

export default function DepositInteraction({depositContractAddress, setDidDeposit}) {
    
    const { write, data, isLoading: loading1 } = useContractWrite({
        addressOrName: depositContractAddress,
        contractInterface: depositABI.abi,
    },
    'confirmDeposit',
    {
        onSuccess(data) {
            showNotification({
                id: data.hash,
                title: 'Depositing...',
                message: <Anchor href={`https://goerli.etherscan.io/tx/${data.hash}`}>View Transaction</Anchor>,
                loading: true,
                autoClose: false,
                disallowClose: true,
            })
        }
    }
    )

    const { isLoading: loading2 } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            setDidDeposit(true)
            updateNotification({
                id: data.transactionHash,
                title: 'Deposit Complete!',
                message: <Anchor href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}>View Transaction</Anchor>,
                loading: false,
                autoClose: 5000,
                icon: <ThemeIcon><IconCircleCheck/></ThemeIcon>,
            })
        }
    }
    )
    
    return (
        <Button onClick={() => write()} loading={loading1} hidden={loading2}>Deposit</Button>
    )
}