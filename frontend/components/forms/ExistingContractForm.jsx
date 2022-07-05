import { useEffect, useState } from "react";
import { useContract, useProvider } from "wagmi";
import { Box, Button, Container, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function ExistingContractForm({depositFactoryAddress, depositFactoryABI,
     setNewContractAddress, setIsNewContract, setIsExistingContract}) {
    const [prevAddresses, setPrevAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    const provider = useProvider();
    const depositFactoryContract = useContract({
        addressOrName: depositFactoryAddress,
        contractInterface: depositFactoryABI,
        signerOrProvider: provider,
    })
    
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
        allPrevContracts();
    },[])

    const form = useForm({
        initialValues: {
            contractAddress: ''
        },
        validate: {
            contractAddress: value => (prevAddresses.includes(value) ? null : 'Please enter a valid deposit contract address'),
        }
    })

    const handleSubmit = values => {
        setNewContractAddress(values.contractAddress);
    }

    return (
     <Container>
            <form onSubmit={form.onSubmit(values => handleSubmit(values))}>
                <TextInput 
                placeholder='0x...'
                {...form.getInputProps('contractAddress')} mb='1rem'/>
                <Button onClick={() => {setIsExistingContract(false); setIsNewContract(false)}} mr='1rem'>Back</Button>
                <Button type='submit' loading={loading}>Submit</Button>
            </form>
     </Container>

    )
}