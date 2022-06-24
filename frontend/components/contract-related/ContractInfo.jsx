import { Container, Stack, Text } from '@mantine/core';
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
            return BigNumber.from(depositAmount).div(BigNumber.from(10).pow(18));
        } else if (token?.symbol === 'USDC') {
            return BigNumber.from(depositAmount).div(BigNumber.from(10).pow(6));
        }
    }

    useEffect(() => {
        getStatus();
    },[didContest, didClaim, contractState])


    return (
        <Container>
            {newlyCreated && <Text>Contract Creation Successful! See the details below and send your buyer the contract address 
                along with this website's information to have them complete the deposit. <br/> You can return to this site 24 hours from
                the agreed date with your contract address (so make sure to save it!) to claim your deposit.
            </Text>}
            <Text>Contract Status: {status}</Text>
            <Text>Contract Address: {depositContractAddress}</Text>
            <Text>Deposit Amount: {numberHandling()?.toString()} {token?.symbol}</Text>
            <Text>Agreed Date: {new Date(agreedDate*1000).toDateString()}</Text>
            {contractState=='Locked' && 
            <Stack spacing={1}>
                <Text>
                    Only the buyer (depositor) can contest on the Agreed Date and only the seller (contract creator) can claim after the Agreed Date.
                </Text>
                <Text>
                    If you don't see the Contest or Claim button make sure you are on the right account.
                </Text>
                <Text>
                    Buyer: {buyer}
                </Text>
                <Text>
                    Seller: {seller}
                </Text>
            </Stack>}
        </Container>
       
            
        
    )
}