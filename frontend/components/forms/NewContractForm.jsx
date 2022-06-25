import { ThemeIcon, Button, NumberInput, RadioGroup, Radio, Container, Anchor } from '@mantine/core';
import { DatePicker } from '@mantine/dates'
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { BigNumber } from "ethers";
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons';

export default function NewContractForm({depositFactoryAddress, depositFactoryABI, account, 
    setNewContractAddress, setIsNewContract, setIsExistingContract, setNewlyCreated,
    daiContractAddress, usdcContractAddress}) {
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const { data, write, isLoading: loading1 } = useContractWrite({
        addressOrName: depositFactoryAddress,
        contractInterface: depositFactoryABI,
    },
    'createDeposit',
    {
        onSuccess(data) {
            showNotification({
                id: data.hash,
                title: 'Creating Contract...',
                message: <Anchor href={`https://goerli.etherscan.io/tx/${data.hash}`}>View Transaction</Anchor>,
                loading: true,
                autoClose: false,
            })
        }
    }
    );
    
    const { isLoading: loading2 } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            const emittedAddress = data.logs[0].address;
            setNewContractAddress(emittedAddress);
            setNewlyCreated(true);
            updateNotification({
                id: data.transactionHash,
                title: 'Contract Created!',
                message: <Anchor href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}>View Transaction</Anchor>,
                loading: false,
                autoClose: 5000,
                icon: <ThemeIcon><IconCircleCheck/></ThemeIcon>,
            })
        }
      }
      );

    const form = useForm({
        initialValues: {
            amount: 0,
            meetupDate: today,
            chosenToken: daiContractAddress,
        },
        validate: {
            amount: value => (value > 0 ? null : 'Amount must be greater than zero'),
            meetupDate: value => (value < yesterday ? 'Meetup date cannot be in the past' : null)
        }
    })

    const handleSubmit = values => {
        const date = parseInt(values.meetupDate.getTime()/1000);
        let amount;
        if (values.chosenToken === usdcContractAddress) {
            amount = BigNumber.from(values.amount).mul(BigNumber.from(10).pow(6))
        } else if (values.chosenToken === daiContractAddress) {
            amount = BigNumber.from(values.amount).mul(BigNumber.from(10).pow(18))
        }
        write({args: [amount, date, values.chosenToken, account.address]});
    }

    return (
            <Container>
                <form onSubmit={form.onSubmit(values => handleSubmit(values))}>
                    <NumberInput 
                    label='Deposit Amount'
                    {...form.getInputProps('amount')} mb='1rem'/>
                    <RadioGroup {...form.getInputProps('chosenToken')} mb='1rem'>
                        <Radio 
                        label='USDC'
                        value={usdcContractAddress}
                        />
                        <Radio 
                        label='DAI'
                        value={daiContractAddress}
                        />
                    </RadioGroup>
                    <DatePicker 
                        label='Meetup Date'
                        {...form.getInputProps('meetupDate')} mb='1rem'/>
                    <Button hidden={loading1 || loading2} onClick={() => {setIsExistingContract(false); setIsNewContract(false)}} mr='1rem'>Back</Button>
                    <Button type='submit' loading={loading1 || loading2}>Submit</Button>
                </form>
            </Container>
                
    )
}