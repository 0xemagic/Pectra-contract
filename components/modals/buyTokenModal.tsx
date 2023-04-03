import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Heading,
    Flex,
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react'

import { MdCheckCircle, MdSettings } from 'react-icons/md'

export default function BuyTokenModal({ isOpen, onClose }: any) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" >
            <ModalOverlay />
            <ModalContent bgColor="#2B3226">
                <ModalHeader>
                    <Flex direction="row" justify="center">
                        <Heading fontSize="25px" variant="heading" color="#BBFF81" mr="0.25rem">$PECTRA</Heading><Heading fontSize="25px" variant="heading">Token Public Sales Terms</Heading>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody mt="1.5rem" px={{base: "1rem", md: "2rem"}}>
                    <List spacing={5}>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='#43931E' />
                            Vesting term is 12 months - until then, your tokens will be locked in the contract (untradable)                        </ListItem>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='#43931E' />
                            Public sales initial price starts at $0.025 per $PECTRA token                        </ListItem>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='#43931E' />
                            Token quantity is capped at 100M - capped raise is at $1,250,000                        </ListItem>
                    </List>
                </ModalBody>
                <ModalFooter mt="1.5rem" >
                    <Flex w="full" direction="row" justify="center">
                        <Button variant="primary" mr={3} onClick={() => onClose()}>
                            Invest in $PECTRA
                        </Button>
                        <Button variant="secondary" w="fit-content">Public Sales Deck</Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}