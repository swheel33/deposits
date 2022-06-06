import { Button, FormControl, FormErrorMessage, Input, FormLabel, VStack, Box } from "@chakra-ui/react";
import { Formik, Field, Form } from 'formik'
import { useEffect, useState } from "react";
import * as Yup from 'yup'



export default function ExistingContractForm({depositFactoryContract, setNewContractAddress}) {
    const [prevAddresses, setPrevAddresses] = useState([]);

    const allPrevContracts = async () => {
        const filter = depositFactoryContract.filters.DepositCreated();
        const events = await depositFactoryContract.queryFilter(filter);
        const addresses = events.map(event => event.args[0])
        setPrevAddresses(addresses);
    }

    //Render all previous contract addresses on mount
    useEffect(() => {
        if(depositFactoryContract) {
            console.log(depositFactoryContract)
            allPrevContracts()
        }
    },[depositFactoryContract])

    return (
     <Formik
     initialValues={{address: ''}}
     validationSchema={Yup.object({
        address: Yup.string()
            .required('Required unless creating a new Deposit contract')
            .oneOf(prevAddresses, `Please enter a valid Deposit contract address. If you don't have one you can
             create a Deposit contract with the Create Deposit button`)
        })}
        onSubmit={(values,actions) => {
            setNewContractAddress(values.address)
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
                    <Button isDisabled={prevAddresses.values[0]} type='submit'>Submit</Button> 
                </VStack>
            </Form> 
        )}
     </Formik>
     
            
        
    )
}