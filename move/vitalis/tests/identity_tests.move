module vitalis::identity_tests {

    use vitalis::vitalis_company as company;
    use vitalis::vitalis_identity as identity;

    use sui::test_scenario;

    #[test]
    fun test_mint_provider_nft_with_approval() {
        let mut ts = test_scenario::begin(@0xA);

        // Create company (shared object)
        company::create_company(b"Vitalis Clinic", 0, test_scenario::ctx(&mut ts));
        test_scenario::next_tx(&mut ts, @0xA);
        let company_obj = test_scenario::take_shared<company::CompanyProfile>(&mut ts);
        let company_id = company::id(&company_obj);

        // Company issues approval to provider wallet
        test_scenario::next_tx(&mut ts, @0xA);
        identity::issue_provider_approval(&company_obj, @0xB, b"Dr. Alice", 0, test_scenario::ctx(&mut ts));

        // Return company_obj to scenario
        test_scenario::return_shared(company_obj);

        // Provider mints by consuming approval
        test_scenario::next_tx(&mut ts, @0xB);
        identity::mint_provider_nft(b"Doctor", test_scenario::take_from_sender<identity::ProviderApproval>(&mut ts), 0, test_scenario::ctx(&mut ts));

        test_scenario::next_tx(&mut ts, @0xB);
        let provider = test_scenario::take_from_sender<identity::ProviderNFT>(&mut ts);

        assert!(identity::provider_wallet(&provider) == @0xB, 1);
        assert!(identity::provider_company_id(&provider) == company_id, 2);

        test_scenario::return_to_address(@0xB, provider);
        test_scenario::end(ts);
    }

    #[test]
    fun test_mint_client_nft() {
        let mut ts = test_scenario::begin(@0xC);

        identity::mint_client_nft(b"Client Bob", 0, test_scenario::ctx(&mut ts));

        test_scenario::next_tx(&mut ts, @0xC);

        let client = test_scenario::take_from_sender<identity::ClientNFT>(&mut ts);

        assert!(identity::client_wallet(&client) == @0xC, 3);

        test_scenario::return_to_address(@0xC, client);
        test_scenario::end(ts);
    }
}
