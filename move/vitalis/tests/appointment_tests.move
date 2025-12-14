module vitalis::appointment_tests {

    use vitalis::vitalis_company as company;
    use vitalis::vitalis_identity as identity;
    use vitalis::vitalis_appointments as appointments;

    use sui::test_scenario;

    #[test]
    fun test_create_appointment() {
        let mut ts = test_scenario::begin(@0xA);

        // Create company (shared)
        company::create_company(b"Vitalis Clinic", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xA);
        let company_obj = test_scenario::take_shared<company::CompanyProfile>(&mut ts);

        // Issue approval and mint provider
        test_scenario::next_tx(&mut ts, @0xA);
        identity::issue_provider_approval(&company_obj, @0xB, b"Dr. Alice", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xB);
        identity::mint_provider_nft(b"Doctor", test_scenario::take_from_sender<identity::ProviderApproval>(&mut ts), 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xB);
        let provider = test_scenario::take_from_sender<identity::ProviderNFT>(&mut ts);

        // Mint client
        test_scenario::next_tx(&mut ts, @0xC);
        identity::mint_client_nft(b"Client Bob", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xC);
        let client = test_scenario::take_from_sender<identity::ClientNFT>(&mut ts);

        // Create appointment
        test_scenario::next_tx(&mut ts, @0xC);
        appointments::create_appointment(
            &company_obj,
            &provider,
            &client,
            1000,
            2000,
            0,
            test_scenario::ctx(&mut ts)
        );

        test_scenario::return_shared(company_obj);

        test_scenario::return_to_address(@0xB, provider);
        test_scenario::return_to_address(@0xC, client);
        test_scenario::end(ts);
    }

    #[test]
    fun test_complete_appointment() {
        let mut ts = test_scenario::begin(@0xA);

        // Setup company
        company::create_company(b"Vitalis Clinic", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xA);
        let company_obj = test_scenario::take_shared<company::CompanyProfile>(&mut ts);
        let company_id = company::id(&company_obj);

        // Provider approval and mint
        test_scenario::next_tx(&mut ts, @0xA);
        identity::issue_provider_approval(&company_obj, @0xB, b"Dr. Alice", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xB);
        identity::mint_provider_nft(b"Doctor", test_scenario::take_from_sender<identity::ProviderApproval>(&mut ts), 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xB);
        let provider = test_scenario::take_from_sender<identity::ProviderNFT>(&mut ts);

        // Client mint
        test_scenario::next_tx(&mut ts, @0xC);
        identity::mint_client_nft(b"Client Bob", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xC);
        let client = test_scenario::take_from_sender<identity::ClientNFT>(&mut ts);

        test_scenario::return_shared(company_obj);

        // Build appointment via test helper
        let mut appointment = appointments::make_test_appointment(
            company_id,
            identity::provider_id(&provider),
            identity::client_id(&client),
            1000,
            2000,
            0,
            test_scenario::ctx(&mut ts),
        );

        // Complete appointment
        test_scenario::next_tx(&mut ts, @0xB);
        appointments::complete_appointment(&provider, &mut appointment, test_scenario::ctx(&mut ts));

        assert!(appointments::status(&appointment) == appointments::status_completed(), 11);

        test_scenario::return_to_address(@0xB, provider);
        test_scenario::return_to_address(@0xC, client);
        appointments::burn_for_test(appointment);
        test_scenario::end(ts);
    }

    #[test]
    fun test_cancel_appointment() {
        let mut ts = test_scenario::begin(@0xA);

        company::create_company(b"Vitalis Clinic", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xA);
        let company_obj = test_scenario::take_shared<company::CompanyProfile>(&mut ts);
        let company_id = company::id(&company_obj);

        test_scenario::next_tx(&mut ts, @0xA);
        identity::issue_provider_approval(&company_obj, @0xB, b"Dr. Alice", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xB);
        identity::mint_provider_nft(b"Doctor", test_scenario::take_from_sender<identity::ProviderApproval>(&mut ts), 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xB);
        let provider = test_scenario::take_from_sender<identity::ProviderNFT>(&mut ts);

        test_scenario::next_tx(&mut ts, @0xC);
        identity::mint_client_nft(b"Client Bob", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xC);
        let client = test_scenario::take_from_sender<identity::ClientNFT>(&mut ts);

        test_scenario::return_shared(company_obj);

        let mut appointment = appointments::make_test_appointment(
            company_id,
            identity::provider_id(&provider),
            identity::client_id(&client),
            1000,
            2000,
            0,
            test_scenario::ctx(&mut ts),
        );

        test_scenario::next_tx(&mut ts, @0xC);
        appointments::cancel_appointment(&client, &mut appointment, test_scenario::ctx(&mut ts));

        assert!(appointments::status(&appointment) == appointments::status_cancelled(), 12);

        test_scenario::return_to_address(@0xB, provider);
        test_scenario::return_to_address(@0xC, client);
        appointments::burn_for_test(appointment);
        test_scenario::end(ts);
    }
}
