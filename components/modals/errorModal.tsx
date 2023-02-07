import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Button,
    Text,
    VStack,
} from "@chakra-ui/react";

type ErrorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    error: string;
    message: string;
}

export default function ErrorModal({
    isOpen,
    onClose,
    error,
    message
}: ErrorModalProps) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="#202020" border="solid 1px rgba(255, 255, 255, 0.2)" py="1rem">
                <ModalHeader>{error}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <Text py="1rem" variant="paragraph">{message}</Text>
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}