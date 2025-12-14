module vitalis::company_tests {

    use vitalis::vitalis_company as company;
    use sui::test_scenario;

    #[test]
    fun test_create_company_shared() {
        let mut ts = test_scenario::begin(@0xA);

        company::create_company(b"Vitalis Clinic", 0, test_scenario::ctx(&mut ts));

        test_scenario::next_tx(&mut ts, @0xA);

        let company_obj = test_scenario::take_shared<company::CompanyProfile>(&mut ts);

        assert!(company::get_company_by_owner(@0xA, &company_obj), 0);

        test_scenario::return_shared(company_obj);
        test_scenario::end(ts);
    }
}
