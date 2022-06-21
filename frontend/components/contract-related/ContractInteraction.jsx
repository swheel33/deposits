import Approve from './Approve';
import Deposit from './Deposit';
import Contest from './Contest';
import Claim from './Claim';
import { Flex } from '@chakra-ui/react';

export default function ContractInteraction({didApprove, didDeposit, didClaim, didContest, setDidApprove,
     setDidDeposit, setDidContest, setDidClaim, tokenContract, depositContract, depositContractAddress, account,
      buyer, seller, claimEligible, contestEligible, depositAmount}) {
    return (
       <Flex justify='center'>
            {(!didApprove && !didDeposit) && <Approve 
                tokenContract={tokenContract} 
                depositContractAddress={depositContractAddress} 
                depositAmount={depositAmount} 
                setDidApprove={setDidApprove}
                />}
            {(didApprove && !didDeposit) && <Deposit depositContract={depositContract} setDidDeposit={setDidDeposit}/>}
            {(contestEligible && !didContest && (account.address == buyer)) && <Contest depositContract={depositContract} setDidContest={setDidContest}/>}
            {(claimEligible && !didClaim && (account.address == seller)) && <Claim depositContract={depositContract} setDidClaim={setDidClaim}/>}
       </Flex>
        
    )
}