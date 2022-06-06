import { Button } from "@chakra-ui/react";
import { useState } from "react";

export default function DepositInteraction({depositContract, setDidDeposit}) {
    const [loading, setLoading] = useState(false);
    
    const handleDeposit = async () => {
        try {
            const tx = await depositContract.confirmDeposit();
            setLoading(true);
            await tx.wait();
            setDidDeposit(true);
            console.log('Successful Deposit!');
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Button onClick={handleDeposit} isLoading={loading} loadingText='Depositing'>Deposit</Button>
    )
}