import { Button } from '@mantine/core';
import { useContractWrite, useWaitForTransaction } from "wagmi";
import depositABI from '../../contracts/Deposit.json'

export default function DepositInteraction({depositContractAddress, setDidDeposit}) {
    
    const { write, data, isLoading: loading1 } = useContractWrite({
        addressOrName: depositContractAddress,
        contractInterface: depositABI.abi,
    },
    'confirmDeposit',
    )

    const { isLoading: loading2 } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess() {
            setDidDeposit(true)
        }
    }
    )
    
    
    return (
        <Button onClick={() => write()} loading={loading1 || loading2}>Deposit</Button>
    )
}