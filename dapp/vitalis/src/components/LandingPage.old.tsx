import { Flex, Heading, Text, Card, Box, Button } from "@radix-ui/themes";
import { ClientRegistration } from "./ClientRegistration";
import { ConnectButton } from "@mysten/dapp-kit";

interface LandingPageProps {
  onRegistrationComplete: () => void;
  onNavigateRegister?: () => void;
}

export function LandingPage({ onRegistrationComplete, onNavigateRegister }: LandingPageProps) {

  const clientSteps = [
    {
      num: "1",
      title: "Create Account",
      desc: "Sign up in seconds with your email and basic info",
    },
    {
      num: "2",
      title: "Browse Services",
      desc: "Explore verified providers and medical beauty treatments",
    },
    {
      num: "3",
      title: "Book Appointment",
      desc: "Schedule with just one click at your preferred time",
    },
    {
      num: "4",
      title: "Manage & Communicate",
      desc: "Stay in touch with providers and update appointments",
    },
  ];

  const privacyItems = [
    {
      icon: "🔐",
      title: "Secure Data Storage",
      body: "All personal and medical data encrypted and stored securely with role-based access controls",
    },
    {
      icon: "👥",
      title: "Role-Based Access",
      body: "Clients, providers, and companies only see information relevant to their role",
    },
    {
      icon: "🔀",
      title: "Data Separation",
      body: "Logical separation ensures users, appointments, messages, and auth status are properly compartmentalized",
    },
    {
      icon: "✅",
      title: "Compliance-Oriented",
      body: "Built to support privacy-first workflows and safe handling of sensitive medical data",
    },
  ];

  const faqs = [
    {
      question: "What is Vitalis?",
      answer: "Vitalis is a specialized platform connecting clients with verified medical beauty and aesthetic service providers for cosmetic treatments and wellness care.",
    },
    {
      question: "Is it safe to book appointments?",
      answer: "Yes! All providers are verified and approved before listing services. Your personal data is encrypted and protected.",
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Absolutely. You can reschedule or cancel appointments directly from your dashboard before the scheduled time.",
    },
    {
      question: "How long until a provider is approved?",
      answer: "Our verification process typically takes 24-48 hours after submitting all required documentation.",
    },
    {
      question: "Do I need a wallet to book?",
      answer: "No, you can book with just your email. A wallet is optional for advanced features.",
    },
    {
      question: "What makes Vitalis different?",
      answer: "We specialize exclusively in medical beauty services with blockchain-backed security, transparent provider verification, and a focus on user privacy.",
    },
  ];

  const handleRegistrationSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    onRegistrationComplete();
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box style={{ minHeight: "100vh", background: "var(--primary-bg)" }}>
      {/* SECTION 1: Header */}
      <Box
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--secondary-bg)",
          borderBottom: "1px solid var(--border-color)",
          boxShadow: "var(--box-shadow-sm)",
        }}
      >
        <Flex
          align="center"
          justify="between"
          style={{
            padding: "1rem clamp(1rem, 5vw, 2rem)",
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            gap: "2rem",
          }}
        >
          {/* Logo */}
          <Flex align="center" gap="2" style={{ flex: "0 0 auto" }}>
            <Box
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--border-radius-md)",
                background: "var(--accent-gradient)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "1.25rem",
              }}
            >
              V
            </Box>
            <Heading
              size="6"
              style={{
                letterSpacing: "-0.02em",
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Vitalis
            </Heading>
          </Flex>

          {/* Navigation Links */}
          <Flex
            gap="clamp(1.5rem, 4vw, 2.5rem)"
            align="center"
            style={{
              flex: 1,
              justifyContent: "center",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {["How It Works", "Privacy & Security", "About Us", "FAQ"].map((link) => (
              <Text
                key={link}
                size="3"
                style={{
                  color: "var(--text-color)",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "var(--transition)",
                }}
                onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-color)")}
              >
                {link}
              </Text>
            ))}
          </Flex>

          {/* CTA Buttons */}
          <Flex gap="1rem" align="center" style={{ flex: "0 0 auto", flexWrap: "wrap" }}>
            <Button
              size="2"
              style={{
                background: "transparent",
                color: "var(--accent-primary)",
                border: "1.5px solid var(--accent-primary)",
                cursor: "pointer",
              }}
            >
              Login
            </Button>
            <Button
              size="2"
              style={{
                background: "var(--accent-gradient)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Contact Us
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* SECTION 2: Hero & Sign Up */}
      <Box
        style={{
          padding: "clamp(2rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <Flex direction="column" gap="3" align="center" style={{ marginBottom: "3rem", textAlign: "center" }}>
          <Heading
            size="8"
            style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-color)",
            }}
          >
            Premium Medical Beauty Services
          </Heading>
          <Text
            size="4"
            style={{
              color: "var(--text-light)",
              maxWidth: "600px",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Discover and book certified aesthetic treatments from trusted professionals. Secure, verified, and designed for your wellness.
          </Text>
        </Flex>

        {/* Hero Cards Grid */}
        <Flex
          gap="2rem"
          wrap="wrap"
          justify="center"
          style={{
            display: "flex",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* Client Sign Up Card */}
          <Card
            style={{
              flex: "1 1 360px",
              minHeight: "480px",
              padding: "2rem",
              background: "var(--secondary-bg)",
              border: "2px solid var(--accent-primary)",
              borderRadius: "var(--border-radius-lg)",
              boxShadow: "var(--box-shadow-md)",
              transition: "var(--transition)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "var(--box-shadow-lg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
            }}
          >
            <Flex direction="column" gap="1.5rem" style={{ height: "100%" }}>
              <Flex direction="column" gap="0.5rem">
                <Heading
                  size="6"
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--accent-primary)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                  }}
                >
                  Client Account
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)" }}>
                  Book your beauty treatments
                </Text>
              </Flex>

              <Flex direction="column" gap="0.75rem">
                {["🎯 Find verified providers", "💬 Direct messaging", "📅 Manage appointments", "⭐ Rate & review"].map(
                  (feature) => (
                    <Text key={feature} size="3" style={{ color: "var(--text-color)" }}>
                      {feature}
                    </Text>
                  )
                )}
              </Flex>

              <Box style={{ flex: 1 }} />

              <Flex direction="column" gap="1rem">
                {onNavigateRegister ? (
                  <Button
                    size="3"
                    style={{
                      background: "var(--accent-gradient)",
                      color: "white",
                      width: "100%",
                      cursor: "pointer",
                      padding: "var(--button-padding-lg)",
                    }}
                    onClick={onNavigateRegister}
                  >
                    Create Account
                  </Button>
                ) : (
                  <div style={{ width: "100%" }}>
                    <ClientRegistration onSuccess={handleRegistrationSuccess} />
                  </div>
                )}
                <Text size="2" style={{ color: "var(--text-light)", textAlign: "center" }}>
                  Takes less than 1 minute
                </Text>
              </Flex>
            </Flex>
          </Card>

          {/* Provider/Login Card */}
          <Card
            style={{
              flex: "1 1 360px",
              minHeight: "480px",
              padding: "2rem",
              background: "var(--secondary-bg)",
              border: "2px solid var(--accent-secondary)",
              borderRadius: "var(--border-radius-lg)",
              boxShadow: "var(--box-shadow-md)",
              transition: "var(--transition)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "var(--box-shadow-lg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
            }}
          >
            <Flex direction="column" gap="1.5rem" style={{ height: "100%" }}>
              <Flex direction="column" gap="0.5rem">
                <Heading
                  size="6"
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--accent-secondary)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                  }}
                >
                  Login / Provider
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)" }}>
                  Connect with Sui wallet
                </Text>
              </Flex>

              <Flex direction="column" gap="0.75rem">
                {["🔐 Wallet authentication", "⚡ Instant access", "🏥 Provider dashboard", "📊 Manage business"].map(
                  (feature) => (
                    <Text key={feature} size="3" style={{ color: "var(--text-color)" }}>
                      {feature}
                    </Text>
                  )
                )}
              </Flex>

              <Box style={{ flex: 1 }} />

              <Flex direction="column" gap="1rem">
                <Box
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--border-radius-md)",
                    background: "var(--accent-light)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <ConnectButton />
                </Box>
                <Text size="2" style={{ color: "var(--text-light)", textAlign: "center" }}>
                  Your keys stay private and secure
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Box>

      {/* SECTION 3: How It Works */}
      <Box
        id="how-it-works"
        style={{
          padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem)",
          background: "var(--secondary-bg)",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <Box style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Flex direction="column" gap="3" align="center" style={{ marginBottom: "3rem", textAlign: "center" }}>
            <Heading
              size="7"
              style={{
                fontSize: "2.5rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "var(--text-color)",
              }}
            >
              How It Works
            </Heading>
            <Text size="4" style={{ color: "var(--text-light)", maxWidth: "500px" }}>
              Simple steps to connect with beauty professionals
            </Text>
          </Flex>

          {/* Tabs */}
          <Flex gap="1rem" justify="center" style={{ marginBottom: "2rem" }}>
            <Button
              size="3"
              style={{
                background: "var(--accent-primary)",
                color: "white",
                cursor: "pointer",
                padding: "var(--button-padding-md)",
              }}
            >
              For Clients
            </Button>
            <Button
              size="3"
              style={{
                background: "transparent",
                color: "var(--accent-primary)",
                border: "1.5px solid var(--accent-primary)",
                cursor: "pointer",
                padding: "var(--button-padding-md)",
              }}
            >
              For Providers
            </Button>
          </Flex>

          {/* Steps Grid */}
          <Flex gap="2rem" wrap="wrap" justify="center">
            {clientSteps.map((step) => (
              <Card
                key={step.num}
                style={{
                  flex: "1 1 240px",
                  padding: "2rem",
                  background: "var(--primary-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-lg)",
                  textAlign: "center",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
                }}
              >
                <Box
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--accent-gradient)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    margin: "0 auto 1rem",
                  }}
                >
                  {step.num}
                </Box>
                <Heading
                  size="4"
                  style={{
                    marginBottom: "0.5rem",
                    color: "var(--text-color)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                  }}
                >
                  {step.title}
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)" }}>
                  {step.desc}
                </Text>
              </Card>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* SECTION 4: Privacy & Security */}
      <Box
        id="privacy-security"
        style={{
          padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem)",
          background: "var(--primary-bg)",
        }}
      >
        <Box style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Flex direction="column" gap="3" align="center" style={{ marginBottom: "3rem", textAlign: "center" }}>
            <Heading
              size="7"
              style={{
                fontSize: "2.5rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "var(--text-color)",
              }}
            >
              Privacy & Security
            </Heading>
            <Text size="4" style={{ color: "var(--text-light)", maxWidth: "500px" }}>
              Your data is protected with industry-leading security practices
            </Text>
          </Flex>

          <Flex gap="2rem" wrap="wrap" justify="center">
            {privacyItems.map((item) => (
              <Card
                key={item.title}
                style={{
                  flex: "1 1 260px",
                  padding: "2rem",
                  background: "var(--secondary-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-lg)",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
                }}
              >
                <Text
                  size="8"
                  style={{
                    marginBottom: "1rem",
                    display: "block",
                  }}
                >
                  {item.icon}
                </Text>
                <Heading
                  size="4"
                  style={{
                    marginBottom: "0.75rem",
                    color: "var(--accent-primary)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)", lineHeight: 1.6 }}>
                  {item.body}
                </Text>
              </Card>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* SECTION 5: About Us */}
      <Box
        id="about-us"
        style={{
          padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem)",
          background: "var(--secondary-bg)",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <Box style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Flex direction="column" gap="3" align="center" style={{ marginBottom: "3rem", textAlign: "center" }}>
            <Heading
              size="7"
              style={{
                fontSize: "2.5rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "var(--text-color)",
              }}
            >
              About Vitalis
            </Heading>
          </Flex>

          <Flex gap="3rem" wrap="wrap" align="center">
            <Box style={{ flex: "1 1 300px", minWidth: "280px" }}>
              <Heading
                size="5"
                style={{
                  marginBottom: "1rem",
                  color: "var(--text-color)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                }}
              >
                Our Mission
              </Heading>
              <Text size="4" style={{ color: "var(--text-light)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                We believe everyone deserves access to quality medical beauty services. Vitalis connects clients with verified, certified professionals in aesthetic medicine and beauty care.
              </Text>
              <Text size="4" style={{ color: "var(--text-light)", lineHeight: 1.8 }}>
                Built on blockchain technology, we ensure transparency, security, and trust at every step of your beauty journey.
              </Text>
            </Box>

            <Card
              style={{
                flex: "1 1 300px",
                minWidth: "280px",
                padding: "2rem",
                background: "var(--accent-gradient-soft)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--border-radius-lg)",
              }}
            >
              <Heading
                size="5"
                style={{
                  marginBottom: "1rem",
                  background: "var(--accent-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                }}
              >
                Our Vision
              </Heading>
              <Text size="4" style={{ color: "var(--text-color)", lineHeight: 1.8 }}>
                To become the global standard for medical beauty service delivery, combining professional expertise with cutting-edge technology and unwavering commitment to user privacy and safety.
              </Text>
            </Card>
          </Flex>
        </Box>
      </Box>

      {/* SECTION 6: FAQ */}
      <Box
        id="faq"
        style={{
          padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem)",
          background: "var(--primary-bg)",
        }}
      >
        <Box style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Flex direction="column" gap="3" align="center" style={{ marginBottom: "3rem", textAlign: "center" }}>
            <Heading
              size="7"
              style={{
                fontSize: "2.5rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "var(--text-color)",
              }}
            >
              Frequently Asked Questions
            </Heading>
            <Text size="4" style={{ color: "var(--text-light)" }}>
              Find answers to common questions
            </Text>
          </Flex>

          <Flex gap="2rem" wrap="wrap" justify="center">
            {faqs.map((item) => (
              <Card
                key={item.question}
                style={{
                  flex: "1 1 380px",
                  padding: "1.75rem",
                  background: "var(--secondary-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-lg)",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
                }}
              >
                <Heading
                  size="4"
                  style={{
                    marginBottom: "0.75rem",
                    color: "var(--accent-primary)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {item.question}
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)", lineHeight: 1.7 }}>
                  {item.answer}
                </Text>
              </Card>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* SECTION 7: Footer */}
      <Box
        style={{
          padding: "3rem clamp(1rem, 5vw, 2rem) 2rem",
          background: "var(--secondary-bg)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <Box style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Flex gap="3rem" wrap="wrap" justify="between" align="start" style={{ marginBottom: "2rem" }}>
            {/* Branding */}
            <Flex direction="column" gap="1rem">
              <Flex align="center" gap="0.75rem">
                <Box
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--border-radius-md)",
                    background: "var(--accent-gradient)",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  V
                </Box>
                <Heading
                  size="5"
                  style={{
                    background: "var(--accent-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Vitalis
                </Heading>
              </Flex>
              <Text size="2" style={{ color: "var(--text-light)" }}>
                Medical Beauty Services Platform
              </Text>
            </Flex>

            {/* Links */}
            <Flex direction="column" gap="0.75rem">
              <Heading size="3" style={{ color: "var(--text-color)", fontWeight: 700 }}>
                Navigation
              </Heading>
              {["How It Works", "Privacy & Security", "About Us", "FAQ"].map((link) => (
                <Text
                  key={link}
                  size="3"
                  style={{
                    color: "var(--text-light)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                  onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-light)")}
                >
                  {link}
                </Text>
              ))}
            </Flex>

            {/* Contact */}
            <Flex direction="column" gap="0.75rem">
              <Heading size="3" style={{ color: "var(--text-color)", fontWeight: 700 }}>
                Contact
              </Heading>
              <Text size="3" style={{ color: "var(--text-light)" }}>
                support@vitalis.io
              </Text>
              <Text size="3" style={{ color: "var(--text-light)" }}>
                +1 (555) 123-4567
              </Text>
            </Flex>

            {/* Social */}
            <Flex direction="column" gap="0.75rem">
              <Heading size="3" style={{ color: "var(--text-color)", fontWeight: 700 }}>
                Follow Us
              </Heading>
              {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                <Text
                  key={social}
                  size="3"
                  style={{
                    color: "var(--text-light)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-light)")}
                >
                  {social}
                </Text>
              ))}
            </Flex>
          </Flex>

          {/* Bottom Footer */}
          <Box
            style={{
              paddingTop: "2rem",
              borderTop: "1px solid var(--border-color)",
              textAlign: "center",
            }}
          >
            <Flex direction="column" gap="0.5rem" align="center">
              <Text size="2" style={{ color: "var(--text-light)" }}>
                © 2025 Vitalis. All rights reserved.
              </Text>
              <Text size="2" style={{ color: "var(--text-lighter)" }}>
                Built on Sui Blockchain • Privacy First • Decentralized
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
