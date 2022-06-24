import { useContract, erc20ABI } from "wagmi"
import { useEffect } from "react";
import ContractInteraction from "./ContractInteraction";

export default function TokenContractInstance({tokenAddress, 
    setDidDeposit, setDidApprove, didDeposit, didApprove,
    didContest,
    didClaim,
    setDidContest,
    setDidClaim,
    depositContract,
    depositContractAddress,
    buyer,
    seller, isLoading,
    claimEligible,
    contestEligible,
    depositAmount, account, provider
}) {
    
    //ERC20 token contract
    const tokenContract = useContract({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        signerOrProvider: provider,
    })

    //Keep track of emitted events/contract variables to check the stage of the contract if the page is refreshed
    const getApprovalStatus = async () => {
        try {
            const filter = tokenContract.filters.Approval([account.address]);
            const event = await tokenContract.queryFilter(filter);
            const approvals = event.map(event => event.args._spender)
            setDidApprove(approvals.includes(depositContractAddress))
        } catch (error) {
            console.log('This account has not yet approved')
        }
    }

    const getDepositStatus = async () => {
        try {
            const filter = tokenContract.filters.Transfer([account.address]);
            const event = await tokenContract.queryFilter(filter);
            const deposits = event.map(event => event.args._to)
            setDidDeposit(deposits.includes(depositContractAddress))
        } catch (error) {
            console.log('This account has not yet deposited')
        }
    } 

    useEffect(() => {
        getApprovalStatus();
    },[didApprove, account])

    useEffect(() => {
        getDepositStatus();
    },[didDeposit, account])
    
    return (
             <ContractInteraction 
                didApprove={didApprove}
                didDeposit={didDeposit} 
                didContest={didContest} 
                didClaim={didClaim}
                setDidApprove={setDidApprove}
                setDidDeposit={setDidDeposit}
                setDidContest={setDidContest}
                setDidClaim={setDidClaim}
                tokenAddress={tokenAddress}
                depositContract={depositContract}
                depositContractAddress={depositContractAddress}
                buyer={buyer}
                seller={seller}
                claimEligible={claimEligible}
                contestEligible={contestEligible}
                depositAmount={depositAmount}
                isLoading={isLoading}
                account={account}/>  
    )
}