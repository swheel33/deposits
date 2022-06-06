import { Button } from "@chakra-ui/react";
import { useState } from "react";

export default function ContestInteraction({depositContract, setDidContest}) {
    const [loading, setLoading] = useState(false);
    
    const handleContestItem = async () => {
        try {
            const tx = await depositContract.contestItem();
            setLoading(true);
            await tx.wait();
            setDidContest(true);
            console.log('Deposit contest successful. Deposit returned to buyer')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Button onClick={handleContestItem} isLoading={loading} loadingText='Contesting'>Contest Item</Button>
    )
}