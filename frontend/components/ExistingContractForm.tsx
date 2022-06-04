import { Button, FormControl, FormErrorMessage, Input, FormLabel, VStack, Box } from "@chakra-ui/react";
import { Formik, Field, Form } from 'formik'
import { useEffect, useState } from "react";
import * as Yup from 'yup'



export default function ExistingContractForm({setNewContract, allPrevContracts}) {
    const [addresses, setAddresses] = useState([]);

    const getAddresses = async () => {
        const values = await allPrevContracts;
        setAddresses(values)
    } 

    //Render all previous contract addresses on mount
    useEffect(() => {
        getAddresses()
    },[])

    return (
     <Formik
     initialValues={{address: ''}}
     validationSchema={Yup.object({
        address: Yup.string()
            .required('Required unless creating a new Deposit contract')
            .oneOf(addresses, `Please enter a valid Deposit contract address. If you don't have one you can
             create a Deposit contract with the Create Deposit button`)
        })}
        onSubmit={(values,actions) => {
            setNewContract(values.address)
            actions.resetForm();
        }}
     >
        {formik =>  (
            <Form onSubmit={formik.handleSubmit}>
                <VStack w={'50%'}>
                    <FormControl isInvalid={formik.errors.address && formik.touched.address}>
                        <FormLabel>Contract Address</FormLabel>
                        <Field as={Input} name='address' value={formik.values.address} {...formik.getFieldProps('address')}/>
                        <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
                    </FormControl>
                    <Button isDisabled={addresses.values[0]} type='submit'>Submit</Button> 
                </VStack>
            </Form> 
        )}
     </Formik>
     
            
        
    )
}