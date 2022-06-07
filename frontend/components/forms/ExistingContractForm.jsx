import { Button, FormControl, FormErrorMessage, Input, FormLabel, VStack, Box, Flex } from "@chakra-ui/react";
import { Formik, Field, Form } from 'formik'
import { useEffect, useState } from "react";
import * as Yup from 'yup'
import BackButton from "./BackButton";



export default function ExistingContractForm({depositFactoryContract, setNewContractAddress, setIsNewContract, setIsExistingContract}) {
    const [prevAddresses, setPrevAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    const allPrevContracts = async () => {
        setLoading(true);
        const filter = depositFactoryContract.filters.DepositCreated();
        const events = await depositFactoryContract.queryFilter(filter);
        const addresses = events.map(event => event.args[0])
        setPrevAddresses(addresses);
        setLoading(false);
    }

    //Render all previous contract addresses on mount
    useEffect(() => {
        if(depositFactoryContract) {
            allPrevContracts()
        }
    },[depositFactoryContract])

    return (
     <Flex>
        <BackButton setIsExistingContract={setIsExistingContract} setIsNewContract={setIsNewContract}/>
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
                        <Button isDisabled={loading} type='submit'>Submit</Button> 
                    </VStack>
                </Form> 
            )}
        </Formik>
     </Flex>
     
     
            
        
    )
}