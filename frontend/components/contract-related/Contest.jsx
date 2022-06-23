import { Button } from '@mantine/core';
import depositABI from '../../contracts/Deposit.json';

export default function ContestInteraction({depositContractAddress, setDidContest}) {

    const { write, data, isLoading: loading1 } = useContractWrite({
        addressOrName: depositContractAddress,
        contractInterface: depositABI.abi,
    },
    'contestItem',
    )

    const { isLoading: loading2 } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess() {
            setDidContest(true)
        }
    }
    )
    
    return (
        <Button onClick={() => write()} loading={loading1 || loading2}>Contest Item</Button>
    )
}