import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card } from "@radix-ui/themes";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    },
  );

  if (!account) {
    return null;
  }

  if (error) {
    return (
      <Card>
        <Text color="red">Error: {error.message}</Text>
      </Card>
    );
  }

  if (isPending || !data) {
    return (
      <Card>
        <Text>Loading objects...</Text>
      </Card>
    );
  }

  if (data.data.length === 0) {
    return (
      <Card>
        <Text color="gray">No Vitalis objects found. Register to get started.</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="2">
        <Heading size="3">Your Objects ({data.data.length})</Heading>
        {data.data.map((object) => (
          <Flex key={object.data?.objectId} direction="column" gap="1">
            <Text size="2">
              <strong>{object.data?.type?.split("::").pop()}</strong>
            </Text>
            <Text size="1" color="gray">
              ID: {object.data?.objectId?.substring(0, 16)}...
            </Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}
