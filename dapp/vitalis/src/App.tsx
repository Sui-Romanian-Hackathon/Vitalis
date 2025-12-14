import { Box, Flex } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient, useDisconnectWallet } from "@mysten/dapp-kit";
import { LandingPage } from "./components/LandingPage";
import { RegistrationPage } from "./components/RegistrationPage";
import { BusinessesPage } from "./components/BusinessesPage";
import { ClientAccount } from "./components/ClientAccount";
import { Header } from "./components/Header";
import { getClientData, clearClientData, saveClientData } from "./clientStorage";
import { VITALIS_PACKAGE_ID } from "./config";

type Page = "landing" | "register" | "businesses" | "account";

function App() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [client, setClient] = useState(getClientData());

  // Check if connected wallet has a ClientNFT
  useEffect(() => {
    const checkForClientNFT = async () => {
      if (!account?.address || client) return;

      console.log("Checking for ClientNFT for address:", account.address);
      
      try {
        // Query for ClientNFT owned by this address
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${VITALIS_PACKAGE_ID}::vitalis_identity::ClientNFT`
          },
          options: {
            showContent: true,
            showType: true,
          }
        });

        console.log("ClientNFT query result:", objects);

        if (objects.data.length > 0) {
          const clientNFT = objects.data[0];
          const content = clientNFT.data?.content;
          
          console.log("Found ClientNFT:", content);
          
          if (content && 'fields' in content) {
            const fields = content.fields as any;
            
            // Save client data to localStorage
            const clientData = {
              id: clientNFT.data?.objectId || account.address,
              wallet: account.address,
              display_name: fields.display_name || "User",
              email: fields.email || "",
              created_at: Number(fields.created_at) || Date.now(),
            };
            
            console.log("Saving client data:", clientData);
            await saveClientData(clientData);
            setClient(clientData);
            setCurrentPage("businesses");
          }
        } else {
          console.log("No ClientNFT found for this address");
          setCurrentPage("register");
        }
      } catch (error) {
        console.error("Error checking for ClientNFT:", error);
      }
    };

    checkForClientNFT();
  }, [account?.address, client, suiClient, currentPage]);

  const handleRegistrationComplete = () => {
    // Refresh client data after registration
    const updatedClient = getClientData();
    setClient(updatedClient);
    setCurrentPage("businesses");
  };

  const handleLogout = () => {
    clearClientData();
    setClient(null);
    setCurrentPage("landing");
    // Disconnect the wallet
    disconnectWallet();
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // Show landing or registration when not logged in
  if (!client) {
    if (currentPage === "register") {
      return (
        <RegistrationPage
          onRegistrationComplete={handleRegistrationComplete}
          onBackToLanding={() => setCurrentPage("landing")}
          walletConnected={!!account?.address}
        />
      );
    }

    return (
      <LandingPage
        onRegistrationComplete={handleRegistrationComplete}
        onNavigateRegister={() => setCurrentPage("register")}
      />
    );
  }

  // Show main app if logged in
  return (
    <Flex direction="column" style={{ minHeight: "100vh" }}>
      <Header
        currentPage={currentPage as "businesses" | "account"}
        onNavigate={handleNavigate}
      />

      <Box
        style={{
          flex: 1,
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {currentPage === "businesses" && <BusinessesPage />}
        {currentPage === "account" && <ClientAccount onLogout={handleLogout} />}
      </Box>
    </Flex>
  );
}

export default App;
