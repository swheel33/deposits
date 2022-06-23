import { Button } from "@chakra-ui/react";
import { useState } from "react";
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
        onSuccess(data) {
            console.log(data)
            setDidDeposit(true)
        }
    }
    )
    
    
    return (
        <Button onClick={() => write()} isLoading={loading1 || loading2} loadingText='Depositing'>Deposit</Button>
    )
}