import { Button } from '@mantine/core';
import depositABI from '../../contracts/Deposit.json';

export default function ClaimInteraction({depositContractAddress, setDidClaim}) {
    
    const { write, data, isLoading: loading1 } = useContractWrite({
        addressOrName: depositContractAddress,
        contractInterface: depositABI.abi,
    },
    'claimFunds',
    )

    const { isLoading: loading2 } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess() {
            setDidClaim(true)
        }
    }
    )
    
    
    return (
        <Button onClick={() => write()} loading={loading1 || loading2}>Claim Funds</Button>
    )
}