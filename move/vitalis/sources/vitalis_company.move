module vitalis::vitalis_company {
    use sui::object;
    use sui::object::{ID, UID};
    use sui::tx_context;
    use sui::tx_context::TxContext;
    use sui::transfer;

    const E_NOT_AUTHORIZED: u64 = 0;

    const STATUS_ACTIVE: u8 = 0;
    const STATUS_INACTIVE: u8 = 1;

    /// Admin capability minted at package init. Holder may perform governance actions.
    public struct CompanyAdminCap has key {
        id: UID,
        authority: address,
    }

    /// Company identity object.
    public struct CompanyProfile has key {
        id: UID,
        name: vector<u8>,
        owner: address,
        created_at: u64,
        status: u8,
    }

    /// Mint the admin cap to the publisher (called at package publish).
    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let cap = CompanyAdminCap { id: object::new(ctx), authority: sender };
        transfer::transfer(cap, sender);
    }

    /// Create a company profile (off-chain approval is handled elsewhere).
    public entry fun create_company(name: vector<u8>, created_at: u64, ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        let company = CompanyProfile {
            id: object::new(ctx),
            name,
            owner,
            created_at,
            status: STATUS_ACTIVE,
        };
        // Share the company object so providers can reference it without the owner signing.
        transfer::share_object(company);
    }

    /// Update company status using the admin capability.
    public entry fun set_company_status(admin: &CompanyAdminCap, company: &mut CompanyProfile, new_status: u8, ctx: &mut TxContext) {
        assert!(admin.authority == tx_context::sender(ctx), E_NOT_AUTHORIZED);
        company.status = new_status;
    }

    /// Return the object ID for cross-module checks.
    public fun id(company: &CompanyProfile): ID {
        object::id(company)
    }

    /// Helper: does this company belong to the given owner address?
    public fun get_company_by_owner(owner: address, company: &CompanyProfile): bool {
        company.owner == owner
    }
}
