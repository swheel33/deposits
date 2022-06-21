import { Button, FormControl, FormErrorMessage, FormLabel, VStack, Flex, Radio } from "@chakra-ui/react";
import { Formik, Form } from 'formik'
import { RadioGroupControl, InputControl } from 'formik-chakra-ui';
import * as Yup from 'yup'
import DatePickerField from "./DatePickerField";
import BackButton from "./BackButton";
import { useContractWrite, useWaitForTransaction } from "wagmi";



export default function NewContractForm({depositFactoryAddress, depositFactoryABI, account, 
    setNewContractAddress, setIsNewContract, setIsExistingContract, setNewlyCreated, setChosenToken,
    daiContractAddress, usdcContractAddress, tetherContractAddress}) {
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
                            const date = parseInt(values.meetupDate.getTime()/1000);
                            write({args: [values.amount, date, values.chosenToken, account.address]});
                            setChosenToken(determineChosenToken(values.chosenToken));
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
                                <Button type='submit' isLoading={isLoading || startLoading} loadingText='Creating Contract'>Create Deposit</Button> 
                            </VStack>
                        </Form> 
                    )}
                </Formik>
            </Flex> 
    )
}