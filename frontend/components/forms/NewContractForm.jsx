import { Button, FormControl, FormErrorMessage, FormLabel, VStack, Flex, Radio } from "@chakra-ui/react";
import { Formik, Form } from 'formik'
import { RadioGroupControl, InputControl } from 'formik-chakra-ui';
import * as Yup from 'yup'
import DatePickerField from "./DatePickerField";
import BackButton from "./BackButton";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { BigNumber } from "ethers";



export default function NewContractForm({depositFactoryAddress, depositFactoryABI, account, 
    setNewContractAddress, setIsNewContract, setIsExistingContract, setNewlyCreated,
    daiContractAddress, usdcContractAddress}) {
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const { data, write, isLoading: startLoading } = useContractWrite({
        addressOrName: depositFactoryAddress,
        contractInterface: depositFactoryABI,
    },
    'createDeposit',
    );
    
    const { isLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            const emittedAddress = data.logs[0].address;
            setNewContractAddress(emittedAddress);
            setNewlyCreated(true);
            console.log(`Contract creation successful! Created contract address is: ${emittedAddress}.`);
        }
      }
      );

    return (
        <Flex>
                <BackButton setIsExistingContract={setIsExistingContract} setIsNewContract={setIsNewContract}/>
                <Formik
                    initialValues={{amount: 0, meetupDate: today, chosenToken: daiContractAddress}}
                    validationSchema={Yup.object({
                        amount: Yup.number()
                            .required('Required')
                            .min(1, 'Please enter a greater than zero deposit amount')
                            .integer('Please enter a whole number'),
                        meetupDate: Yup.date()
                            .min(yesterday, 'Please enter a future date.')
                            .nullable()
                            .default(undefined)
                            .required('Please enter a meetup date')
                        })}
                        onSubmit={values => {
                            //Need additional formatting since js uses ms for timestamp and blockchain is in s
                            const date = parseInt(values.meetupDate.getTime()/1000);
                            let amount;
                            if (values.chosenToken === usdcContractAddress) {
                                amount = BigNumber.from(values.amount).mul(BigNumber.from(10).pow(6))
                            } else if (values.chosenToken === daiContractAddress) {
                                amount = BigNumber.from(values.amount).mul(BigNumber.from(10).pow(18))
                            }
                            write({args: [amount, date, values.chosenToken, account.address]});
                        }}
                    >
                    {formik =>  (
                        <Form onSubmit={formik.handleSubmit}>
                            <VStack>
                                <InputControl name='amount' label='Deposit Amount'/>
                                <RadioGroupControl name='chosenToken' label='Deposit Token'>
                                    <Radio value={daiContractAddress}>Dai</Radio>
                                    <Radio value={usdcContractAddress}>USDC</Radio>
                                </RadioGroupControl>
                                <FormControl isInvalid={formik.errors.meetupDate && formik.touched.meetupDate}>
                                    <FormLabel>Meetup Date</FormLabel>
                                    <DatePickerField name='meetupDate'/>
                                    <FormErrorMessage>{formik.errors.meetupDate}</FormErrorMessage>
                                </FormControl>
                                <Button type='submit' isLoading={isLoading || startLoading} loadingText='Creating Contract'>Create Deposit</Button> 
                            </VStack>
                        </Form> 
                    )}
                </Formik>
            </Flex> 
    )
}