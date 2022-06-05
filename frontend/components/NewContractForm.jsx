import { Button, FormControl, FormErrorMessage, Input, FormLabel, VStack, Box } from "@chakra-ui/react";
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import DatePickerField from "./DatePickerField";


export default function NewContractForm({setApprovalAmount, setMeetupDate }) {
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return (
        <Formik
     initialValues={{amount: 0, meetupDate: today}}
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
            setApprovalAmount(values.amount);
            //Need additional formatting since js uses ms for timestamp and blockchain is in s
            setMeetupDate(parseInt(values.meetupDate.getTime()/1000));
        }}
     >
        {formik =>  (
            <Form onSubmit={formik.handleSubmit}>
                <VStack w={'50%'}>
                    <FormControl isInvalid={formik.errors.amount && formik.touched.amount}>
                        <FormLabel>Deposit Amount</FormLabel>
                        <Field as={Input} name='amount' value={formik.values.amount} />
                        <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={formik.errors.meetupDate && formik.touched.meetupDate}>
                        <FormLabel>Meetup Date</FormLabel>
                        <DatePickerField name='meetupDate'/>
                        <FormErrorMessage>{formik.errors.meetupDate}</FormErrorMessage>
                    </FormControl>
                    <Button type='submit'>Create Deposit</Button> 
                </VStack>
            </Form> 
        )}
     </Formik>
    )
}