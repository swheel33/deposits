import { Button } from '@chakra-ui/react';
import { useContractWrite, erc20ABI, useWaitForTransaction } from 'wagmi';
import { BigNumber } from 'ethers';

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
        <Button onClick={() => write()} isLoading={loading1 || loading2} loadingText='Approving'>Approve</Button>
    )
}