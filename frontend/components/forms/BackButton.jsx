import { Button } from "@chakra-ui/react";

export default function BackButton({setIsExistingContract, setIsNewContract}) {
    const handleClick = () => {
        setIsExistingContract(false);
        setIsNewContract(false);
    }
    
    return (
        <Button onClick={handleClick} pos='fixed' left={['0.5rem','2rem']} size={['sm', 'lg']}>Back</Button>
    )
}