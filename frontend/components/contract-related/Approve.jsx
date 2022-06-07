import { Button, Box, Text } from '@chakra-ui/react';
import { useState } from "react";

export default function ApproveInteraction({tokenContract, depositContractAddress, depositAmount, setDidApprove}) {
    const [loading, setLoading] = useState(false);
    
    const handleApprove = async () => {
        try {
            setLoading(true)
            const tx = await tokenContract.approve(depositContractAddress, depositAmount);
            await tx.wait();
            setDidApprove(true);
            console.log('Successful Approval!');
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    
    return (  
        <Button onClick={handleApprove} isLoading={loading} loadingText='Approving'>Approve</Button>
    )
}