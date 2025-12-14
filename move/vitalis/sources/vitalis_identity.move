module vitalis::vitalis_identity {
    use std::option;
    use sui::object;
    use sui::object::{ID, UID};
    use sui::tx_context;
    use sui::tx_context::TxContext;
    use sui::transfer;
    use vitalis::vitalis_company::{CompanyProfile, id as company_id, get_company_by_owner};

    const ROLE_NONE: u8 = 0;
    const ROLE_COMPANY: u8 = 1;
    const ROLE_PROVIDER: u8 = 2;
    const ROLE_CLIENT: u8 = 3;

    /// Admin capability for identity actions (e.g., forced deactivation).
    public struct IdentityAdminCap has key {
        id: UID,
        authority: address,
    }

    /// Non-transferable provider NFT (doctor/practitioner identity).
    public struct ProviderNFT has key {
        id: UID,
        name: vector<u8>,
        company_id: ID,
        wallet: address,
        role: vector<u8>,
        active: bool,
        created_at: u64,
    }

    /// One-time approval ticket issued by the company owner to a provider wallet.
    /// The ticket is consumed when minting the ProviderNFT.
    public struct ProviderApproval has key {
        id: UID,
        company_id: ID,
        wallet: address,
        name: vector<u8>,
        created_at: u64,
    }

    /// Client identity NFT.
    public struct ClientNFT has key {
        id: UID,
        wallet: address,
        display_name: vector<u8>,
        created_at: u64,
    }

    /// Mint the identity admin cap to the publisher.
    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let cap = IdentityAdminCap { id: object::new(ctx), authority: sender };
        transfer::transfer(cap, sender);
    }

    /// Issue a ProviderApproval ticket to a provider wallet.
    /// Only the company owner can issue approvals.
    public entry fun issue_provider_approval(company: &CompanyProfile, provider_wallet: address, name: vector<u8>, created_at: u64, ctx: &mut TxContext) {
        assert!(get_company_by_owner(tx_context::sender(ctx), company), 0);
        let approval = ProviderApproval {
            id: object::new(ctx),
            company_id: company_id(company),
            wallet: provider_wallet,
            name,
            created_at,
        };
        transfer::transfer(approval, provider_wallet);
    }

    /// Mint a provider NFT by consuming a ProviderApproval ticket.
    /// Validates that the caller owns the approval and matches the intended wallet.
    public entry fun mint_provider_nft(role: vector<u8>, approval: ProviderApproval, created_at: u64, ctx: &mut TxContext) {
        let wallet = tx_context::sender(ctx);
        let ProviderApproval { id: appr_uid, company_id: appr_company_id, wallet: appr_wallet, name: appr_name, created_at: _appr_created_at } = approval;
        assert!(wallet == appr_wallet, 0);
        let provider = ProviderNFT {
            id: object::new(ctx),
            name: appr_name,
            company_id: appr_company_id,
            wallet,
            role,
            active: true,
            created_at,
        };
        transfer::transfer(provider, wallet);
        // Properly consume and delete the approval ticket object
        object::delete(appr_uid);
    }

    /// Mint a client NFT for the caller.
    public entry fun mint_client_nft(display_name: vector<u8>, created_at: u64, ctx: &mut TxContext) {
        let wallet = tx_context::sender(ctx);
        let client = ClientNFT {
            id: object::new(ctx),
            wallet,
            display_name,
            created_at,
        };
        transfer::transfer(client, wallet);
    }

    /// Force-deactivate a provider via admin cap (MVP governance hook).
    public entry fun deactivate_provider(admin: &IdentityAdminCap, provider: &mut ProviderNFT, ctx: &mut TxContext) {
        assert!(admin.authority == tx_context::sender(ctx), 0);
        provider.active = false;
    }

    /// Return the provider object ID for cross-module checks.
    public fun provider_id(provider: &ProviderNFT): ID {
        object::id(provider)
    }

    /// Return the client object ID for cross-module checks.
    public fun client_id(client: &ClientNFT): ID {
        object::id(client)
    }

    /// Accessors used cross-module.
    public fun provider_company_id(provider: &ProviderNFT): ID { provider.company_id }
    public fun provider_wallet(provider: &ProviderNFT): address { provider.wallet }
    public fun provider_active(provider: &ProviderNFT): bool { provider.active }
    public fun client_wallet(client: &ClientNFT): address { client.wallet }

    /// Resolve the wallet role with pre-fetched addresses (off-chain indexing).
    /// Priority: company > provider > client. Off-chain caller should pass the known wallet addresses, or None.
    public fun get_role_by_wallet(
        wallet: address,
        company_owner: option::Option<address>,
        provider_wallet: option::Option<address>,
        client_wallet_addr: option::Option<address>
    ): u8 {
        if (option::is_some(&company_owner) && *option::borrow(&company_owner) == wallet) {
            ROLE_COMPANY
        } else if (option::is_some(&provider_wallet) && *option::borrow(&provider_wallet) == wallet) {
            ROLE_PROVIDER
        } else if (option::is_some(&client_wallet_addr) && *option::borrow(&client_wallet_addr) == wallet) {
            ROLE_CLIENT
        } else {
            ROLE_NONE
        }
    }
}
