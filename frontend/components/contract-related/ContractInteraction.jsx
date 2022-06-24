import Approve from './Approve';
import Deposit from './Deposit';
import Contest from './Contest';
import Claim from './Claim';
import { Box } from '@mantine/core';

export default function ContractInteraction({didApprove, didDeposit, didClaim, didContest, setDidApprove,
     setDidDeposit, setDidContest, setDidClaim, tokenAddress, depositContractAddress, account,
      buyer, seller, claimEligible, contestEligible, depositAmount, isLoading}) {
    
    return (
       <Box>
            {!isLoading && <Box>
                {(!didApprove && !didDeposit) && <Approve 
                    tokenAddress={tokenAddress} 
                    depositContractAddress={depositContractAddress} 
                    depositAmount={depositAmount} 
                    setDidApprove={setDidApprove}
                    />}
                {(didApprove && !didDeposit) && <Deposit depositContractAddress={depositContractAddress} setDidDeposit={setDidDeposit}/>}
                {(contestEligible && !didContest && (account?.address == buyer)) && <Contest depositContractAddress={depositContractAddress} setDidContest={setDidContest}/>}
                {(claimEligible && !didClaim && (account?.address == seller)) && <Claim depositContractAddress={depositContractAddress} setDidClaim={setDidClaim}/>}
            </Box> }
       </Box>
       
        
    )
}