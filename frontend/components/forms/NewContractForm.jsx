import { Button, FormControl, FormErrorMessage, Input, FormLabel, VStack, Box, Flex, RadioGroup, HStack, Radio } from "@chakra-ui/react";
import { Formik, Field, Form } from 'formik'
import { RadioGroupControl, InputControl } from 'formik-chakra-ui';
import * as Yup from 'yup'
import DatePickerField from "./DatePickerField";
import { useState } from 'react'
import BackButton from "./BackButton";


export default function NewContractForm({depositFactoryContract, accounts, 
    setNewContractAddress, setIsNewContract, setIsExistingContract, setNewlyCreated, setChosenToken,
    daiContractAddress, usdcContractAddress, tetherContractAddress}) {
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const [loading, setLoading] = useState(false);

    const depositHandler = async (approvalAmount, meetupDate, chosenTokenAddress) => {
        try {
            setLoading(true);
            const tx = await depositFactoryContract.createDeposit(approvalAmount, meetupDate , chosenTokenAddress, accounts[0]);
            const receipt = await tx.wait();
            const emittedAddress = receipt.logs[0].address;
            setNewlyCreated(true);
            setChosenToken(determineChosenToken(chosenTokenAddress));
            setNewContractAddress(emittedAddress);
            console.log(`Contract creation successful! Created contract address is: ${emittedAddress}. Deposit amount is ${approvalAmount} and the agreed date is ${meetupDate}.`);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const determineChosenToken = chosenTokenAddress => {
        if (chosenTokenAddress === daiContractAddress) {
            return 'Dai';
        } else if (chosenTokenAddress === usdcContractAddress) {
            return 'USDC';
        } else if (chosenTokenAddress === tetherContractAddress) {
            return 'Tether'
        } else {
            return null
        }
    }

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
                            depositHandler(values.amount, parseInt(values.meetupDate.getTime()/1000), values.chosenToken);
                        }}
                    >
                    {formik =>  (
                        <Form onSubmit={formik.handleSubmit}>
                            <VStack>
                                <InputControl name='amount' label='Deposit Amount'/>
                                <RadioGroupControl name='chosenToken' label='Deposit Token'>
                                    <Radio value={daiContractAddress}>Dai</Radio>
                                    <Radio value={usdcContractAddress}>USDC</Radio>
                                    <Radio value={tetherContractAddress}>Tether</Radio>
                                </RadioGroupControl>
                                <FormControl isInvalid={formik.errors.meetupDate && formik.touched.meetupDate}>
                                    <FormLabel>Meetup Date</FormLabel>
                                    <DatePickerField name='meetupDate'/>
                                    <FormErrorMessage>{formik.errors.meetupDate}</FormErrorMessage>
                                </FormControl>
                                <Button type='submit' isLoading={loading} loadingText='Creating Contract'>Create Deposit</Button> 
                            </VStack>
                        </Form> 
                    )}
                </Formik>
            </Flex> 
    )
}