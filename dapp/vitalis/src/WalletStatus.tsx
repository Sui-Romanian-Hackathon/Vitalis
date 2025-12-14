import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text, Card } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

export function WalletStatus() {
  const account = useCurrentAccount();

  if (!account) {
    return (
      <Card>
        <Text color="gray">Connect your wallet to get started</Text>
      </Card>
    );
  }

  return (
    <Container>
      <Flex direction="column" gap="4">
        <Card>
          <Flex direction="column" gap="2">
            <Heading size="3">Wallet Connected</Heading>
            <Text size="2">Address: {account.address}</Text>
          </Flex>
        </Card>
        <OwnedObjects />
      </Flex>
    </Container>
  );
}
