import { Button, Box, Flex, Heading, ListItem, OrderedList, Text, VStack, HStack, Link } from "@chakra-ui/react";
import { useState } from "react";
import { BigNumber } from "ethers";

export default function About({setIsAbout, daiTokenContract, USDCTokenContract, tetherTokenContract, accounts}) {
    //I was having issues with the accounts not working being passed down 2 levels so the faucet stuff is here instead of a separate component
    const [loadingDai, setLoadingDai] = useState(false);
    const [loadingUSDC, setLoadingUSDC] = useState(false);
    const [loadingTether, setLoadingTether] = useState(false);
    
    //Big number handling to get 1000 tokens
    let oneThousand = BigNumber.from("10");
    oneThousand = oneThousand.pow(21);


    const daiMint = async () => {
        try {
            setLoadingDai(true)
            const response = await daiTokenContract.mint(accounts[0], oneThousand);
            await response.wait();
            setLoadingDai(false)
        } catch (error) {
            console.log(error);
            setLoadingDai(false);
        }
    }

    const usdcMint = async () => {
        try {
            setLoadingUSDC(true)
            const response = await USDCTokenContract.mint(accounts[0], oneThousand);
            await response.wait();
            setLoadingUSDC(false)
        } catch (error) {
            console.log(error);
            setLoadingUSDC(false);
        }
    }

    const tetherMint = async () => {
        try {
            setLoadingTether(true)
            const response = await tetherTokenContract.mint(accounts[0], oneThousand);
            await response.wait();
            setLoadingTether(false)
        } catch (error) {
            console.log(error);
            setLoadingTether(false);
        }
    }
    
    return (
        <Flex pl='2rem' w='100%'>
            <Button onClick={() => setIsAbout(false)}>Back</Button>
            <Flex justify='center' w='90%'>
                <VStack w='80%'>
                    <Heading>About</Heading>
                    <Text>
                        Welcome to my SafeDeposit App! This app is built for for purpose of handling Facebook Marketplace deposits.
                        A usually schemy environment fraught with fraud, SafeDeposits attempts to reign in part of that by handling deposits
                        for theoretically sold items. "Theoretically" sold because anyone who's sold items on an open marketplace (like Facebook Marketplace 
                        or Craigslist) gets a ton of people claiming to want to buy the item, and asking to have it reserved only to never show up for pickup.
                        <br /> <br />
                        However, usually buyers are wary to put down a deposit to handle these types of transactions. After all, venmoing money to a random
                        stranger on the internet is usually a way to lose your money. Where SafeDeposits comes in is by harnessing the power of smart
                        contracts to create an escrow like service for Buyers and Sellers to safely handle deposits without the risk of a scam.
                        <br /> <br />
                        SafeDeposits handles this interaction using a series of steps:
                    </Text>
                    <Box w='100%'>
                        <OrderedList>
                            <ListItem>
                                The Seller navigates to this website and clicks the Create New Deposit Contract button, then 
                                selects the amount he/she would like the buyer to deposit, the type of coin the deposit
                                should be in, and the agreed upon date for the seller and buyer to meetup to complete the 
                                transaction
                            </ListItem>
                            <ListItem>
                                The Seller saves the contract address that is given upon completing the previous step and sends 
                                that information to the Buyer along with this website address.
                            </ListItem>
                            <ListItem>
                                The Buyer navigates to this website and clicks the Use Existing Deposit Contract button and enters
                                the contract address that they were given by the seller.
                            </ListItem>
                            <ListItem>
                                Once the contract has loaded the buyer will approve the contract instance to access to the amount
                                requested by the Seller (no infinite approvals here), and then complete the deposit.
                            </ListItem>
                            <ListItem>
                                After the Buyer deposits the funds (which the seller can confirm at any time by accessing the contract instance
                                the same way the buyer would), the two parties wait until the agreed upon date.
                            </ListItem>
                            <ListItem>
                                When the agreed upon date arrives, the Buyer has the opportunity to contest the deposit if the item is not as 
                                described by the seller. This can be done through the UI, accessing the contract instance the same way the Buyer 
                                deposited his/her funds.
                            </ListItem>
                            <ListItem>
                                If 24 hours pass from the agreed upon date (ie the start of the next day) the Buyer will no longer be able to contest the 
                                deposit and the Seller can claim their funds (after hopefully meeting up with the Buyer to sell the item as well).
                            </ListItem>
                            <br />
                        </OrderedList>
                        <Text fontSize='2xl' fontWeight='bold'>Contesting Game Theory</Text>
                        <Text>
                            The contesting process can only by done during the agreed upon date and only by the Buyer. 
                            If a Buyer contests the deposit, the Buyer is returned the funds no questions asked. This provides a safeguard against
                            the seller working as a bad actor in his deposit, and should help the Buyer feel confident that he/she can get their deposit
                            back if there are any issues with the item.
                            <br />
                            On the Seller's end, assumming the Buyer as a bad actor, the Buyer can only contest
                            on the agreed upon day. Additionally, if the Buyer is willing to go through the effort of completing the sequence 
                            of steps required to deposit (while there are only a few), it's reasonable to assume that the Buyer is willing to go through 
                            with the sale.
                            <br /> <br />
                        </Text>
                        <Text fontSize='2xl' fontWeight='bold'>App Notes</Text>
                        <Text>
                            First of all if you've made it through the wall of text, bravo. Now since this app is just a portfolio project (code availible <span></span>
                             <Link isExternal color='blue' href='https://github.com/swheel33/deposits'>here</Link> and from the github logo in the footer) and not meant for production, this app is deployed on the Rinkeby Testnet. Verified contract
                             address <Link isExternal color='blue' href='https://rinkeby.etherscan.io/address/0xAEA66E013CDA1e8675eA757cD9ADDA4b466578Dd'>here</Link>.
                             I didn't deploy it on the Mainnet or even Arbitrum because no one wants to pay fees while they are testing out someone else's work.
                            I've linked some faucets below to get any of the tokens accepted by the app (Dai, USDC, Tether) on the fairly likely 
                            chance that you don't have a wallet with Rinkeby ported ERC20 tokens. <br /> <br />
                        </Text>
                        <Flex>
                            
                            {!accounts && <Text fontWeight='bold'>Please connect wallet to use faucet</Text>}
                            {accounts && <Flex>
                                            <HStack>
                                                <Button onClick={daiMint} isLoading={loadingDai} loadingText='Minting Dai'>Mint 1000 Dai</Button>
                                                <Button onClick={usdcMint} isLoading={loadingUSDC} loadingText='Minting USDC'>Mint 1000 USDC</Button>
                                                <Button onClick={tetherMint} isLoading={loadingTether} loadingText='Minting Tether'>Mint 1000 Tether</Button>
                                            </HStack>
                                        </Flex>}
                            
                        </Flex>
                    </Box>
                </VStack>
            </Flex>
        </Flex>
    )
}