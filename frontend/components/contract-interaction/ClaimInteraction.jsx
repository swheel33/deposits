import { Button } from "@chakra-ui/react";
import { useState } from "react";

export default function ClaimInteraction({depositContract, setDidClaim}) {
    const [loading, setLoading] = useState(false);
    
    const handleClaimFunds = async () => {
        try {
            const tx = await depositContract.claimFunds();
            setLoading(true);
            await tx.wait();
            setDidClaim(true);
            console.log('Deposit claim successful!')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Button onClick={handleClaimFunds} isLoading={loading} loadingText='Claiming Funds'>Claim Funds</Button>
    )
}