import { Button, Anchor, ThemeIcon } from '@mantine/core';
import depositABI from '../../contracts/Deposit.json';
import { useWaitForTransaction, useContractWrite } from 'wagmi';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons';

export default function ContestInteraction({depositContractAddress, setDidContest}) {

    const { write, data, isLoading: loading1 } = useContractWrite({
        addressOrName: depositContractAddress,
        contractInterface: depositABI.abi,
    },
    'contestItem',
    {
        onSuccess(data) {
            showNotification({
                id: data.hash,
                title: 'Contesting...',
                message: <Anchor href={`https://goerli.etherscan.io/tx/${data.hash}`}>View Transaction</Anchor>,
                loading: true,
                autoClose: false,
            })
        }
    }
    )

    const { isLoading: loading2 } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            setDidContest(true)
            updateNotification({
                id: data.transactionHash,
                title: 'Deposit Contested!',
                message: <Anchor href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}>View Transaction</Anchor>,
                loading: false,
                autoClose: 5000,
                icon: <ThemeIcon><IconCircleCheck/></ThemeIcon>,
            })
        }
    }
    )
    
    return (
        <Button onClick={() => write()} loading={loading1} hidden={loading2}>Contest Item</Button>
    )
}