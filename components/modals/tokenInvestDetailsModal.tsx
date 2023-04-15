import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { BigNumberish } from "ethers";
import { commify, formatUnits } from "ethers/lib/utils";
import { useAccount, useBalance } from "wagmi";
import { useBuyTokens } from "../hooks/usePublicSale";
import { truncate } from "../utils";

type Props = {
  onCloseDashboard: () => void;
  isOpenDashboard: boolean;
  onOpenBuy: () => void;
  publicPectraBalance: BigNumberish;
  migratorBalance: any;
  totalBalance: any;
  spectraPrice: BigNumberish;
};

export default function TokenDetailsModal({
  isOpenDashboard,
  onCloseDashboard,
  onOpenBuy,
  publicPectraBalance,
  migratorBalance,
  totalBalance,
}: Props) {

  // const {
  //     data: privateSaleBalance,
  //     isError: isErrorPrivate,
  //     isLoading: privateLoading,
  // } = useBalance({
  //     address: address,
  //     token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  // });

  const balances = [
    // [
    //     privateSaleBalance?.formatted?.toString(),
    //     "Private Sale"
    // ],
    [+formatUnits(publicPectraBalance! as BigNumberish), "Public Sale"],
    [migratorBalance?.formatted, "OG Migrator"],
  ];

  return (
    <Modal
      isCentered
      isOpen={isOpenDashboard}
      onClose={onCloseDashboard}
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent py="1rem" bgColor="#2B3226" borderRadius="2xl">
        <ModalHeader>
          <Flex direction="row" justify="center">
            <Heading
              fontSize="25px"
              variant="heading"
              color="#BBFF81"
              mr="0.25rem"
            >
              $PECTRA
            </Heading>
            <Heading fontSize="25px" variant="heading">
              TOKEN BALANCE BREAKDOWN
            </Heading>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mt="1.5rem" px={{ base: "1rem", md: "2rem" }}>
          <>
            <Flex
              flexDir="column"
              mb="2.25rem"
              // mt="1.5rem"
              alignItems="center"
              justifyItems="center"
            >
              <Text
                variant="paragraph"
                fontSize="0.85rem"
                color="#FFFFFF"
                opacity="0.7"
              >
                Total Token Value
              </Text>
              <Flex
                direction="column"
                alignItems="center"
                justifyItems="center"
              >
                <Heading
                  variant="heading"
                  fontSize={{ base: "1.5rem", md: "2rem" }}
                >
                  $
                  {totalBalance
                    ? commify(truncate(totalBalance.toString(), 2))
                    : 0}
                </Heading>
              </Flex>
              <Flex
                alignItems="center"
                justifyContent="center"
                placeContent="center"
                mt="0.75rem"
                mr="0.5rem"
                // color="#43931E"
              >
                <Text
                  variant="paragraph"
                  mr="0.25rem"
                  fontSize={{ base: "0.5rem", md: "0.75rem" }}
                  textAlign="center"
                >
                  ($0.025 per $PECTRA)
                </Text>
              </Flex>
            </Flex>
            <Flex
              fontFamily="body"
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              w="full"
            >
              {balances.map((balance, index) => {
                console.log();
                return (
                  <>
                    {balance[0] === 0 ||
                    balance[0] === undefined ||
                    balance[0] === "0.0" ? null : (
                      <Flex
                        flexDir="column"
                        mb="0.25rem"
                        alignItems="center"
                        justifyItems="center"
                        key={index}
                      >
                        <Text
                          variant="paragraph"
                          fontSize="0.85rem"
                          color="#FFFFFF"
                          opacity="0.7"
                        >
                          {balance[1]}
                        </Text>
                        <Flex
                          direction="column"
                          alignItems="center"
                          justifyItems="center"
                        >
                          <Heading
                            variant="heading"
                            fontSize={{ base: "1.5rem", md: "2rem" }}
                          >
                            {" "}
                            {balance[0]
                              ? commify(truncate(balance[0].toString(), 2))
                              : 0}
                          </Heading>
                          <Heading
                            mt="0.25rem"
                            variant="heading"
                            color="#81FF7E"
                            fontSize={{ base: "0.5rem", md: "1.25rem" }}
                          >
                            {" "}
                            $PECTRA
                          </Heading>
                        </Flex>
                      </Flex>
                    )}{" "}
                  </>
                );
              })}
            </Flex>
          </>
        </ModalBody>
        <ModalFooter mt="1.5rem">
          <Flex w="full" direction="row" justify="center">
            <Button
              variant="primary"
              w="fit-content"
              mr={3}
              onClick={() => {
                onCloseDashboard(), onOpenBuy();
              }}
            >
              BUY MORE $PECTRA
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
