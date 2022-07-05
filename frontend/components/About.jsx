import { Button, Text, List, Stack, Anchor, Container, Title} from '@mantine/core'

export default function About({ setIsAbout }) {
    
    return (
        <Container p='0'>
                <Button onClick={() => setIsAbout(false)} mb='1rem'>Back</Button>
                <Stack>
                    <Title weight={700}>About</Title>
                    <Text>
                        Welcome to my SafeDeposit App! This app is built for for purpose of handling Facebook Marketplace deposits.
                        A usually schemy environment fraught with fraud, SafeDeposits attempts to reign in part of that by handling deposits
                        for theoretically sold items. "Theoretically" sold because anyone who's sold items on an open marketplace (like Facebook Marketplace 
                        or Craigslist) gets a ton of people claiming to want to buy the item, and asking to have it reserved only to never show up for pickup.
                    </Text>
                    <Text>
                        However, usually buyers are wary to put down a deposit to handle these types of transactions. After all, venmoing money to a random
                        stranger on the internet is usually a way to lose your money. Where SafeDeposits comes in is by harnessing the power of smart
                        contracts to create an escrow like service for Buyers and Sellers to safely handle deposits without the risk of a scam.
                    </Text>
                    <Text>
                        SafeDeposits handles this interaction using a series of steps:
                    </Text>
                    <List>
                        <List.Item >
                            The Seller navigates to this website and clicks the Create New Deposit Contract button, then 
                            selects the amount he/she would like the buyer to deposit, the type of coin the deposit
                            should be in, and the agreed upon date for the seller and buyer to meetup to complete the 
                            transaction
                        </List.Item>
                        <List.Item>
                            The Seller saves the contract address that is given upon completing the previous step and sends 
                            that information to the Buyer along with this website address.
                        </List.Item>
                        <List.Item>
                            The Buyer navigates to this website and clicks the Use Existing Deposit Contract button and enters
                            the contract address that they were given by the seller.
                        </List.Item>
                        <List.Item>
                            Once the contract has loaded the buyer will approve the contract instance to access to the amount
                            requested by the Seller (no infinite approvals here), and then complete the deposit.
                        </List.Item>
                        <List.Item>
                            After the Buyer deposits the funds (which the seller can confirm at any time by accessing the contract instance
                            the same way the buyer would), the two parties wait until the agreed upon date.
                        </List.Item>
                        <List.Item>
                            When the agreed upon date arrives, the Buyer has the opportunity to contest the deposit if the item is not as 
                            described by the seller. This can be done through the UI, accessing the contract instance the same way the Buyer 
                            deposited his/her funds.
                        </List.Item>
                        <List.Item>
                            If 24 hours pass from the agreed upon date (ie the start of the next day) the Buyer will no longer be able to contest the 
                            deposit and the Seller can claim their funds (after hopefully meeting up with the Buyer to sell the item as well).
                        </List.Item>
                        <br />
                    </List>
                    <Title weight={700}>Contesting Game Theory</Title>
                    <Text>
                        The contesting process can only by done during the agreed upon date and only by the Buyer. 
                        If a Buyer contests the deposit, the Buyer is returned the funds no questions asked. This provides a safeguard against
                        the seller working as a bad actor in his deposit, and should help the Buyer feel confident that he/she can get their deposit
                        back if there are any issues with the item.
                    </Text>
                    <Text>
                        On the Seller's end, assumming the Buyer as a bad actor, the Buyer can only contest
                        on the agreed upon day. Additionally, if the Buyer is willing to go through the effort of completing the sequence 
                        of steps required to deposit (while there are only a few), it's reasonable to assume that the Buyer is willing to go through 
                        with the sale.
                    </Text>
                    <Title weight={700}>App Notes</Title>
                    <Text>
                        First of all if you've made it through the wall of text, bravo. Now since this app is just a portfolio project (code availible <span></span>
                            <Anchor href='https://github.com/swheel33/deposits'>here</Anchor> and from the github logo in the footer) and not meant for production, this app is deployed on the Goerli Testnet. Verified contract
                            address <Anchor href='https://goerli.etherscan.io/address/0x787662aa7847533E04516Db00D31933b14A1D195'>here</Anchor>.
                            I didn't deploy it on the Mainnet or even Arbitrum because no one wants to pay fees while they are testing out someone else's work.
                        Faucet for the ERC20 ported tokens is at <Anchor href='https://app.compound.finance/'>https://app.compound.finance/</Anchor>. 
                        Connect to the Goerli testnet and click withdraw on either USDC/DAI to get tokens.
                    </Text>
                </Stack>
            </Container>
    )
}