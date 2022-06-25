import { Button, Anchor, ThemeIcon } from '@mantine/core';
import { useContractWrite, erc20ABI, useWaitForTransaction } from 'wagmi';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons';

export default function ApproveInteraction({tokenAddress, depositContractAddress, depositAmount, setDidApprove}) {
    
    const { write, data, isLoading: loading1 } = useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
    },
    'approve',
    {
        args: [depositContractAddress, depositAmount],
        onSuccess(data) {
            showNotification({
                id: data.hash,
                title: 'Approving...',
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
            setDidApprove(true)
            updateNotification({
                id: data.transactionHash,
                title: 'Allowance Approved!',
                message: <Anchor href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}>View Transaction</Anchor>,
                loading: false,
                autoClose: 5000,
                icon: <ThemeIcon><IconCircleCheck/></ThemeIcon>,
            })
        }
    }
    )
   
    return (  
        <Button onClick={() => write()} loading={loading1} hidden={loading2}>Approve</Button>
    )
}