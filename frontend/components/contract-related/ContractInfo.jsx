import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';


export default function ContractInfo({didApprove, didDeposit, didContest, didClaim, contractState,
     contractAddress, depositAmount, tokenAddress, agreedDate, buyer, seller, newlyCreated,
    daiContractAddress, usdcContractAddress, tetherContractAddress}) {
    const [amountReadable, setAmountReadable] = useState();
    const [dateReadable, setDateReadable] = useState();
    const [status, setStatus] = useState();
    const [chosenToken, setChosenToken] = useState();

    useEffect(() => {
        if (depositAmount) {
            setAmountReadable(depositAmount.toString())
        }
    },[depositAmount])

    useEffect(() => {
        if (agreedDate) {
            setDateReadable(agreedDate.toDateString())
        }
    },[agreedDate])

    const getStatus = () => {
        if (!didApprove && !didDeposit && contractState=='Created') {
            setStatus('Created');
        } else if (didApprove && !didDeposit && contractState=='Created') {
            setStatus('Allowance Approved');
        } else if (contractState=='Locked') {
            setStatus('Deposit Completed');
        } else if (didContest) {
            setStatus('Inactive (Deposit Contested)')
        } else if (didClaim) {
            setStatus('Inactive (Deposit Claimed)')
        }
    }

    const getChosenToken = () => {
        if (tokenAddress===daiContractAddress) {
            setChosenToken('Dai')
        } else if (tokenAddress===usdcContractAddress) {
            setChosenToken('USDC')
        } else if (tokenAddress===tetherContractAddress) {
            setChosenToken('Tether')
        }
    }

    useEffect(() => {
        getStatus();
    },[didApprove, didDeposit, didContest, didClaim, contractState])

    useEffect(() => {
        getChosenToken();
    },[chosenToken])

    return (
        <Box borderWidth='0.2rem' borderRadius='lg' p='1rem' m='1rem' borderColor='black'>
            {newlyCreated && <Text>Contract Creation Successful! See the details below and send your buyer the contract address 
                along with this website's information to have them complete the deposit. <br/> You can return to this site 24 hours from
                the agreed date with your contract address (so make sure to save it!) to claim your deposit.
            </Text>}
            {newlyCreated && <br/>}
            <Text>Contract Status: {status}</Text>
            <Text>Contract Address: {contractAddress}</Text>
            <Text>Deposit Amount: {amountReadable} {chosenToken}</Text>
            <Text>Agreed Date: {dateReadable}</Text>
            {contractState=='Locked' && <br/>}
            {contractState=='Locked' && <Text>
                Only the buyer (depositor) can contest and only the seller (contract creator) can claim.
                <br/>
                If you don't see the Contest or Claim button make sure you are on the right account.
                <br />
                Buyer: {buyer}
                <br />
                Seller: {seller}
                </Text>}
        </Box>
    )
}