module vitalis::vitalis_appointments {
    use sui::object;
    use sui::object::{ID, UID};
    use sui::transfer;
    use sui::tx_context;
    use sui::tx_context::TxContext;
    use vitalis::vitalis_company::{CompanyProfile, id as company_id};
    use vitalis::vitalis_identity::{client_id, client_wallet, provider_active, provider_company_id, provider_id, provider_wallet, ClientNFT, ProviderNFT};

    const E_PROVIDER_COMPANY_MISMATCH: u64 = 0;
    const E_PROVIDER_INACTIVE: u64 = 1;
    const E_INVALID_TIME: u64 = 2;
    const E_ONLY_CLIENT: u64 = 3;
    const E_ONLY_PROVIDER: u64 = 4;
    const E_ALREADY_TERMINAL: u64 = 5;
    const E_CLIENT_MISMATCH: u64 = 6;

    const STATUS_BOOKED: u8 = 0;
    const STATUS_COMPLETED: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;

    /// On-chain appointment lifecycle object.
    public struct Appointment has key {
        id: UID,
        company_id: ID,
        provider_id: ID,
        client_id: ID,
        start_time: u64,
        end_time: u64,
        status: u8,
        created_at: u64,
    }

    /// Lightweight appointment variant for MVP: stores provider name instead of provider/company object IDs.
    public struct LightAppointment has key {
        id: UID,
        client_id: ID,
        provider_name: vector<u8>,
        start_time: u64,
        end_time: u64,
        status: u8,
        created_at: u64,
    }

    public fun status_booked(): u8 { STATUS_BOOKED }
    public fun status_completed(): u8 { STATUS_COMPLETED }
    public fun status_cancelled(): u8 { STATUS_CANCELLED }
    public fun status(appt: &Appointment): u8 { appt.status }
    public fun status_light(appt: &LightAppointment): u8 { appt.status }

    /// Create and share an appointment. Off-chain validation (codes, availability) must happen before calling.
    public entry fun create_appointment(
        company_obj: &CompanyProfile,
        provider: &ProviderNFT,
        client: &ClientNFT,
        start_time: u64,
        end_time: u64,
        created_at: u64,
        ctx: &mut TxContext
    ) {
        assert!(provider_company_id(provider) == company_id(company_obj), E_PROVIDER_COMPANY_MISMATCH);
        assert!(provider_active(provider), E_PROVIDER_INACTIVE);
        assert!(start_time < end_time, E_INVALID_TIME);

        let appointment = Appointment {
            id: object::new(ctx),
            company_id: company_id(company_obj),
            provider_id: provider_id(provider),
            client_id: client_id(client),
            start_time,
            end_time,
            status: STATUS_BOOKED,
            created_at,
        };
        transfer::share_object(appointment);
    }

    /// Lightweight create: only needs the client NFT and a provider name string.
    public entry fun create_appointment_light(
        client: &ClientNFT,
        provider_name: vector<u8>,
        start_time: u64,
        end_time: u64,
        created_at: u64,
        ctx: &mut TxContext
    ) {
        assert!(start_time < end_time, E_INVALID_TIME);
        assert!(tx_context::sender(ctx) == client_wallet(client), E_ONLY_CLIENT);

        let appointment = LightAppointment {
            id: object::new(ctx),
            client_id: client_id(client),
            provider_name,
            start_time,
            end_time,
            status: STATUS_BOOKED,
            created_at,
        };
        transfer::share_object(appointment);
    }

    /// Cancel an appointment (client-owned authority).
    public entry fun cancel_appointment(client: &ClientNFT, appointment: &mut Appointment, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == client_wallet(client), E_ONLY_CLIENT);
        assert!(appointment.client_id == client_id(client), E_CLIENT_MISMATCH);
        assert!(appointment.status == STATUS_BOOKED, E_ALREADY_TERMINAL);
        appointment.status = STATUS_CANCELLED;
    }

    /// Cancel lightweight appointment (client authority).
    public entry fun cancel_appointment_light(client: &ClientNFT, appointment: &mut LightAppointment, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == client_wallet(client), E_ONLY_CLIENT);
        assert!(appointment.client_id == client_id(client), E_CLIENT_MISMATCH);
        assert!(appointment.status == STATUS_BOOKED, E_ALREADY_TERMINAL);
        appointment.status = STATUS_CANCELLED;
    }

    /// Mark an appointment as completed (provider authority).
    public entry fun complete_appointment(provider: &ProviderNFT, appointment: &mut Appointment, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == provider_wallet(provider), E_ONLY_PROVIDER);
        assert!(appointment.provider_id == provider_id(provider), E_PROVIDER_COMPANY_MISMATCH);
        assert!(appointment.status == STATUS_BOOKED, E_ALREADY_TERMINAL);
        appointment.status = STATUS_COMPLETED;
    }

    /// Helper to expose the appointment ID.
    public fun id(appointment: &Appointment): ID {
        object::id(appointment)
    }

    /// Test-only helper to consume an appointment by deleting its UID (keeps tests clean).
    #[test_only]
    public fun burn_for_test(appointment: Appointment) {
        let Appointment { id, company_id: _, provider_id: _, client_id: _, start_time: _, end_time: _, status: _, created_at: _ } = appointment;
        object::delete(id);
    }


}
