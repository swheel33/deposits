import { Button } from '@mantine/core';
import { useContractWrite, erc20ABI, useWaitForTransaction } from 'wagmi';

export default function ApproveInteraction({tokenAddress, depositContractAddress, depositAmount, setDidApprove}) {
    
    const { write, data, isLoading: loading1 } = useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
    },
    'approve',
    {
        args: [depositContractAddress, depositAmount]
    }
    )

    const { isLoading: loading2 } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess() {
            setDidApprove(true)
        }
    }
    )
   
    return (  
        <Button onClick={() => write()} loading={loading1 || loading2}>Approve</Button>
    )
}