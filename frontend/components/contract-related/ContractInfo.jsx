import { Box, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useToken } from 'wagmi';



export default function ContractInfo({didContest, didClaim, contractState,
    depositContractAddress, depositAmount, agreedDate, buyer, seller, newlyCreated, tokenAddress
    }) {
    const [status, setStatus] = useState();

    //const agreedDateReadable = new Date(agreedDate*1000).toDateString();
    //const depositAmountReadable = depositAmount.toString();

    const getStatus = () => {
        if (contractState=='Created') {
            setStatus('Created');
        } else if (contractState=='Locked') {
            setStatus('Deposit Completed');
        } else if (didContest) {
            setStatus('Inactive (Deposit Contested)')
        } else if (didClaim) {
            setStatus('Inactive (Deposit Claimed)')
        }
    }

    const { data: token } = useToken({
        address: tokenAddress,
    })

    const numberHandling = () => {
        if (token?.symbol === 'DAI') {
            depositAmount = BigNumber.from(depositAmount).div(BigNumber.from(10).pow(18)).toString();
        } else if (token?.symbol === 'USDC') {
            depositAmount = BigNumber.from(depositAmount).div(BigNumber.from(10).pow(6)).toString();
        }
    }


    useEffect(() => {
        getStatus();
    },[didContest, didClaim, contractState])

    useEffect(() => {
        numberHandling()
    },[token])


    return (
        <Box borderWidth='0.2rem' borderRadius='lg' p='1rem' m='1rem' borderColor='black'>
            {newlyCreated && <Text>Contract Creation Successful! See the details below and send your buyer the contract address 
                along with this website's information to have them complete the deposit. <br/> You can return to this site 24 hours from
                the agreed date with your contract address (so make sure to save it!) to claim your deposit.
            </Text>}
            {newlyCreated && <br/>}
            <Text>Contract Status: {status}</Text>
            <Text>Contract Address: {depositContractAddress}</Text>
            <Text>Deposit Amount: {depositAmount} {token?.symbol}</Text>
            <Text>Agreed Date: {new Date(agreedDate*1000).toDateString()}</Text>
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