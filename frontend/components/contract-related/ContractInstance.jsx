import { Box, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ContractInteraction from './ContractInteraction'
import ContractInfo from './ContractInfo';


export default function ContractInstance({tokenContract, depositContract, depositContractAddress,
     accounts, newlyCreated, daiContractAddress,
    usdcContractAddress, tetherContractAddress, chosenToken, setChosenToken}) {
    //State variable declaration to track progress
    const [didDeposit, setDidDeposit] = useState(false);
    const [didApprove, setDidApprove] = useState(false);
    const [didContest, setDidContest] = useState(false);
    const [didClaim, setDidClaim] = useState(false);
    const [contestEligible, setContestEligible] = useState(false);
    const [claimEligible, setClaimEligible] = useState(false);
    const [agreedDate, setAgreedDate] = useState(new Date());
    const [deadline, setDeadline] = useState(new Date());
    const [depositAmount, setDepositAmount] = useState();
    const [buyer, setBuyer] = useState();
    const [seller, setSeller] = useState();
    const [contractState, setContractState] = useState();
    const [isLoading, setIsLoading] = useState(true);
    

    //Keep track of emitted events/contract variables to check the stage of the contract if the page is refreshed
    const getApprovalStatus = async () => {
        try {
            const filter = tokenContract.filters.Approval([accounts[0]]);
            const event = await tokenContract.queryFilter(filter);
            const approvals = event.map(event => event.args.spender)
            setDidApprove(approvals.includes(depositContractAddress))
        } catch (error) {
            console.log('This account has not yet approved')
        }
    }

    const getDepositStatus = async () => {
        try {
            const filter = tokenContract.filters.Transfer([accounts[0]]);
            const event = await tokenContract.queryFilter(filter);
            const deposits = event.map(event => event.args.to)
            setDidDeposit(deposits.includes(depositContractAddress))
        } catch (error) {
            console.log('This account has not yet deposited')
        }
    } 
    
    const getContestStatus = async () => {
        try {
            const filter = depositContract.filters.ContestComplete();
            const event = await depositContract.queryFilter(filter);
            if (event[0]) {
                setDidContest(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getClaimStatus = async () => {
        try {
            const filter = depositContract.filters.ClaimComplete();
            const event = await depositContract.queryFilter(filter);
            if (event[0]) {
                setDidClaim(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    //This section is getting info from the smart contract itself

    const getAgreedDate = async () => {
        try {
            const agreedDateUnix = await depositContract.getAgreedDate();
            const agreedDateReadable = new Date(agreedDateUnix*1000);
            setAgreedDate(agreedDateReadable);
        } catch (error) {
            console.log(error)
        }
    }

    const getDeadline = async () => {
        try {
            const deadlineUnix = await depositContract.getDeadline();
            const deadlineReadable = new Date(deadlineUnix*1000);
            setDeadline(deadlineReadable);
        } catch (error) {
            console.log(error)
        }
    }

    const getDepositAmount = async () => {
        try {
            const depositAmount = await depositContract.getDepositValue();
            setDepositAmount(depositAmount);
        } catch (error) {
            console.log(error);
        }
    }

    const getBuyer = async () => {
        try {
            const buyer = await depositContract.getBuyer();
            setBuyer(buyer);
        } catch (error) {
            console.log(error);
        }
    }

    const getSeller = async () => {
        try {
            const seller = await depositContract.getSeller();
            setSeller(seller);
        } catch (error) {
            console.log(error);
        }
    }

    const getContractState = async () => {
        try {
            const contractState = await depositContract.getCurrentState();
            setContractState(contractState);
        } catch (error) {
            console.log(error);
        }
    }

    const getChosenToken = async () => {
        try {
            const tokenAddress = await depositContract.getTokenAddress();
            if (tokenAddress === daiContractAddress) {
                setChosenToken('Dai');
            } else if (tokenAddress === usdcContractAddress) {
                setChosenToken('USDC');
            } else if (tokenAddress === tetherContractAddress) {
                setChosenToken('Tether');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getContestEligibility = async () => {
        try {
            if (didDeposit) {
                const now = new Date();
                setContestEligible(now > agreedDate && now < deadline);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getClaimEligibility = async () => {
        try {
            if(!didContest && didDeposit) {
                const now = new Date();
                setClaimEligible(now > deadline);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getApprovalStatus();
    },[didApprove, accounts, tokenContract])

    useEffect(() => {
        getDepositStatus();
    },[didDeposit, tokenContract])

    useEffect(() => {
        getContestStatus();
    },[didContest])

    useEffect(() => {
        getClaimStatus();
    },[didClaim])

   useEffect(() => {
       getContractState();
   }, [didApprove, didDeposit, didClaim, didContest])

    useEffect(() => {
       getBuyer();
       getSeller();
    }, [accounts, didDeposit])

    useEffect(() => {
        getDepositAmount();
        getAgreedDate();
        getDeadline();
        getChosenToken();
    },[])

    /* Not only on mount cause it's possible that immediately after deposit you could contest if the agreed upon date is today.
    The other edge case this accounts for is a deposit after the 24 hours from the agreed date which is techincally possible and then
    you can instantly claim. */
    useEffect(() => {
        getContestEligibility();
        getClaimEligibility();
    },[didDeposit, deadline])


    useEffect(() => {
        setIsLoading(!depositAmount || !deadline || !agreedDate || !contractState);
    },[depositAmount, deadline, agreedDate, contractState])
    
    return (
        <Box>
            {isLoading && <Heading>Loading...</Heading>}
            {!isLoading && <Box>
                                <ContractInfo 
                                    didApprove={didApprove}
                                    didDeposit={didDeposit} 
                                    didContest={didContest} 
                                    didClaim={didClaim}
                                    contractState={contractState}
                                    contractAddress={depositContractAddress}
                                    depositAmount={depositAmount}
                                    chosenToken={chosenToken}
                                    daiContractAddress={daiContractAddress}
                                    usdcContractAddress={usdcContractAddress}
                                    tetherContractAddress={tetherContractAddress}
                                    agreedDate={agreedDate}
                                    buyer={buyer}
                                    seller={seller}
                                    newlyCreated={newlyCreated}
                                /> 
                                {!newlyCreated && <ContractInteraction 
                                    didApprove={didApprove}
                                    didDeposit={didDeposit} 
                                    didContest={didContest} 
                                    didClaim={didClaim}
                                    setDidApprove={setDidApprove}
                                    setDidDeposit={setDidDeposit}
                                    setDidContest={setDidContest}
                                    setDidClaim={setDidClaim}
                                    tokenContract={tokenContract}
                                    depositContract={depositContract}
                                    depositContractAddress={depositContractAddress}
                                    buyer={buyer}
                                    seller={seller}
                                    claimEligible={claimEligible}
                                    contestEligible={contestEligible}
                                    depositAmount={depositAmount}
                                    accounts={accounts}/> }
            </Box> }
        </Box>
    )
}