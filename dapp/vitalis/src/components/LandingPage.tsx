import { Flex, Heading, Text, Card, Box, Button } from "@radix-ui/themes";
import { CheckCircle2, Shield, Database, FileCheck, ChevronDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

interface LandingPageProps {
  onRegistrationComplete: () => void;
  onNavigateRegister?: () => void;
  onLogin?: () => void;
}

export function LandingPage({ onRegistrationComplete, onNavigateRegister }: LandingPageProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({ name: "", email: "", message: "" });
  const account = useCurrentAccount();

  const clientSteps = [
    { num: "1", title: "Create Account", desc: "Sign up in seconds" },
    { num: "2", title: "Browse Services", desc: "Find treatments and providers" },
    { num: "3", title: "Book Appointments", desc: "Schedule with one click" },
    { num: "4", title: "Manage & Reschedule", desc: "Control your appointments" },
    { num: "5", title: "Communicate", desc: "Message specialists directly" },
    { num: "6", title: "Review & Rate", desc: "Share your experience" },
  ];

  const providerSteps = [
    { num: "1", title: "Contact Us", desc: "Contact us via the form" },
    { num: "2", title: "Authorization", desc: "Status becomes Pending" },
    { num: "3", title: "Get Approved", desc: "Verification process" },
    { num: "4", title: "Operate", desc: "Manage appointments & clients" },
    { num: "5", title: "Messaging", desc: "Communicate with clients" },
    { num: "6", title: "Grow", desc: "Reach new clients" },
  ];

  const privacyItems = [
    {
      icon: Shield,
      title: "Secure Data Storage",
      body: "Your personal data is stored securely. Access is role-based and controlled.",
    },
    {
      icon: Database,
      title: "Role-Based Access",
      body: "Clients, specialists, and companies have separated access to relevant features.",
    },
    {
      icon: Database,
      title: "Data Separation",
      body: "Logical separation between users, appointments, messages, notifications, and auth status.",
    },
    {
      icon: FileCheck,
      title: "Compliance-Oriented",
      body: "Designed to support privacy-first workflows and safe handling of sensitive data.",
    },
  ];

  const faqs = [
    {
      question: "What is Vitalis?",
      answer: "Vitalis is a specialized platform connecting clients with verified medical beauty and aesthetic service providers for cosmetic treatments and wellness care.",
    },
    {
      question: "How do I book an appointment?",
      answer: "Create an account, browse services, select a provider, and click to book at your preferred time. You can manage and reschedule appointments from your dashboard.",
    },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box style={{ minHeight: "100vh", background: "var(--primary-bg)" }}>
      {/* Header */}
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
            padding: "1.25rem clamp(1.5rem, 5vw, 3rem)",
            maxWidth: "1400px",
            margin: "0 auto",
            gap: "2rem",
          }}
        >
          <Flex align="center" gap="3">
            <Box
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "var(--border-radius-sm)",
                background: "var(--accent-gradient)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px rgba(176, 70, 162, 0.2)",
              }}
            >
              V
            </Box>
            <Heading
              size="6"
              style={{
                fontFamily: "var(--font-heading)",
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}
            >
              Vitalis
            </Heading>
          </Flex>

          <Flex gap="2.5rem" align="center" style={{ flex: 1, justifyContent: "center" }}>
            {["How It Works", "Privacy & Security", "About Us", "FAQ"].map((link) => (
              <Text
                key={link}
                size="3"
                style={{
                  color: "var(--text-color)",
                  cursor: "pointer",
                  fontWeight: 400,
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

          <Flex gap="0.75rem" align="center">
            <Button
              size="2"
              onClick={() => setShowLoginModal(true)}
              style={{
                background: "transparent",
                color: "var(--accent-primary)",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                borderRadius: "var(--border-radius-sm)",
                padding: "0.625rem 1.25rem",
                fontWeight: 400,
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-very-light)";
                e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Login
            </Button>
            <Button
              size="2"
              onClick={() => setShowContactForm(true)}
              style={{
                background: "var(--accent-gradient)",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "var(--border-radius-sm)",
                padding: "0.625rem 1.25rem",
                fontWeight: 500,
                transition: "var(--transition)",
                boxShadow: "var(--box-shadow-sm)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--box-shadow-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--box-shadow-sm)")}
            >
              Contact Us
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Hero Section with Form */}
      <Box style={{ padding: "4rem clamp(1.5rem, 5vw, 3rem)", maxWidth: "1400px", margin: "0 auto" }}>
        <Flex gap="4rem" align="center" style={{ minHeight: "70vh" }}>
          {/* Left - Hero */}
          <Flex direction="column" gap="2rem" style={{ flex: 1, maxWidth: "600px" }}>
            <Heading
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                lineHeight: 1.1,
                color: "var(--text-color)",
              }}
            >
              Your Gateway to Premium{" "}
              <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Medical Beauty
              </span>{" "}
              Services
            </Heading>
            <Text size="4" style={{ color: "var(--text-light)", lineHeight: 1.7, fontWeight: 400 }}>
              Discover, book, and manage aesthetic treatments with trusted professionals. Vitalis connects clients with certified providers for a seamless beauty care experience.
            </Text>
            <Flex gap="1rem" wrap="wrap">
              {["Verified Providers", "Easy Booking", "Direct Messaging", "Secure Platform"].map((item) => (
                <Flex key={item} align="center" gap="2">
                  <CheckCircle2 size={20} color="var(--accent-primary)" />
                  <Text size="3" weight="medium">{item}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>

          {/* Right - CTA Button */}
          <Flex direction="column" align="center" justify="center" gap="2rem" style={{ flex: 1, maxWidth: "460px", minHeight: "400px" }}>
            <Box
              style={{
                padding: "3rem 2rem",
                background: "var(--secondary-bg)",
                borderRadius: "12px",
                border: "2px solid var(--accent-gradient)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <Heading size="5" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                Ready to Get Started?
              </Heading>
              <Text size="3" style={{ color: "var(--text-light)", lineHeight: 1.6 }}>
                Create your account to browse treatments, book appointments, and connect with top-rated beauty professionals.
              </Text>
              <Button
                size="3"
                onClick={() => onNavigateRegister?.()}
                style={{
                  background: "var(--accent-gradient)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "var(--border-radius-sm)",
                  padding: "0.875rem 2rem",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Register Now <ArrowRight size={20} />
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* How It Works */}
      <Box id="how-it-works" style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)", background: "var(--secondary-bg)" }}>
        <Flex direction="column" align="center" gap="4rem" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Heading size="8" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, textAlign: "center" }}>
            How It Works
          </Heading>

          <Flex direction="column" gap="5rem" style={{ width: "100%" }}>
            {/* For Clients */}
            <Flex direction="column" gap="2rem">
              <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                For Clients
              </Heading>
              <Flex gap="2rem" wrap="wrap" justify="center" style={{ position: "relative" }}>
                {/* Timeline Line */}
                <Box style={{
                  position: "absolute",
                  top: "30px",
                  left: "10%",
                  right: "10%",
                  height: "2px",
                  background: "var(--accent-gradient)",
                  zIndex: 0,
                }} />
                
                {clientSteps.map((step, i) => (
                  <Flex key={i} direction="column" align="center" gap="1rem" style={{ flex: "0 0 150px", zIndex: 1 }}>
                    <Box
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "var(--accent-gradient)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        boxShadow: "var(--box-shadow-md)",
                      }}
                    >
                      {step.num}
                    </Box>
                    <Text size="3" weight="bold" style={{ textAlign: "center" }}>
                      {step.title}
                    </Text>
                    <Text size="2" style={{ color: "var(--text-light)", textAlign: "center" }}>
                      {step.desc}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>

            {/* For Providers */}
            <Flex direction="column" gap="2rem">
              <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                For Providers & Companies
              </Heading>
              <Flex gap="2rem" wrap="wrap" justify="center" style={{ position: "relative" }}>
                <Box style={{
                  position: "absolute",
                  top: "30px",
                  left: "10%",
                  right: "10%",
                  height: "2px",
                  background: "var(--accent-gradient)",
                  zIndex: 0,
                }} />
                
                {providerSteps.map((step, i) => (
                  <Flex key={i} direction="column" align="center" gap="1rem" style={{ flex: "0 0 150px", zIndex: 1 }}>
                    <Box
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "var(--accent-gradient)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        boxShadow: "var(--box-shadow-md)",
                      }}
                    >
                      {step.num}
                    </Box>
                    <Text size="3" weight="bold" style={{ textAlign: "center" }}>
                      {step.title}
                    </Text>
                    <Text size="2" style={{ color: "var(--text-light)", textAlign: "center" }}>
                      {step.desc}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Privacy & Security */}
      <Box id="privacy-&-security" style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}>
        <Flex direction="column" align="center" gap="3rem" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Heading size="8" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
            Privacy & Security
          </Heading>
          <Flex gap="2rem" wrap="wrap" justify="center">
            {privacyItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Card
                  key={i}
                  style={{
                    flex: "1 1 250px",
                    maxWidth: "300px",
                    padding: "2rem",
                    background: "var(--secondary-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius-md)",
                    boxShadow: "var(--box-shadow-sm)",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--box-shadow-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--box-shadow-sm)")}
                >
                  <Flex direction="column" align="center" gap="1rem" style={{ textAlign: "center" }}>
                    <Icon size={40} color="var(--accent-primary)" strokeWidth={1.5} />
                    <Heading size="4" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                      {item.title}
                    </Heading>
                    <Text size="3" style={{ color: "var(--text-light)" }}>
                      {item.body}
                    </Text>
                  </Flex>
                </Card>
              );
            })}
          </Flex>
        </Flex>
      </Box>

      {/* About Us */}
      <Box id="about-us" style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)", background: "var(--secondary-bg)" }}>
        <Flex direction="column" align="center" gap="2rem" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <Heading size="8" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
            About Vitalis
          </Heading>
          <Text size="4" style={{ color: "var(--text-light)", lineHeight: 1.8 }}>
            Vitalis was born from a vision to revolutionize the medical beauty industry by creating a trusted platform that connects clients with certified professionals.
          </Text>
          <Text size="4" style={{ color: "var(--text-light)", lineHeight: 1.8 }}>
            We focus exclusively on medical beauty and aesthetic treatments. Our platform bridges the gap between quality care and modern convenience.
          </Text>
        </Flex>
      </Box>

      {/* FAQ */}
      <Box id="faq" style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}>
        <Flex direction="column" align="center" gap="3rem" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Heading size="8" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
            Frequently Asked Questions
          </Heading>
          <Flex direction="column" gap="1rem" style={{ width: "100%" }}>
            {faqs.map((faq, i) => (
              <Card
                key={i}
                style={{
                  padding: "1.5rem",
                  background: "var(--secondary-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-md)",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <Flex justify="between" align="center">
                  <Heading size="4" style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}>
                    {faq.question}
                  </Heading>
                  <ChevronDown
                    size={24}
                    style={{
                      transform: expandedFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "var(--transition)",
                    }}
                  />
                </Flex>
                {expandedFaq === i && (
                  <Text size="3" style={{ color: "var(--text-light)", marginTop: "1rem", lineHeight: 1.7 }}>
                    {faq.answer}
                  </Text>
                )}
              </Card>
            ))}
          </Flex>
          
          <Card style={{ padding: "2rem", width: "100%", background: "var(--accent-very-light)", border: "1px solid var(--border-color)", borderRadius: "var(--border-radius-md)" }}>
            <Flex direction="column" gap="1rem">
              <Text size="3" weight="bold">Can't find your question?</Text>
              <textarea
                placeholder="Type your question here..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "1rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
              />
              <Button
                style={{
                  background: "var(--accent-gradient)",
                  color: "white",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "var(--border-radius-sm)",
                  fontWeight: 500,
                  width: "fit-content",
                }}
              >
                Submit Question
              </Button>
            </Flex>
          </Card>
        </Flex>
      </Box>

      {/* Login Modal */}
      {showLoginModal && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <Card
            style={{
              maxWidth: "500px",
              width: "90%",
              padding: "2.5rem",
              background: "var(--secondary-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius-lg)",
              boxShadow: "var(--box-shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Flex direction="column" gap="2rem">
              <Flex direction="column" gap="1rem">
                <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                  Login with Wallet
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)", lineHeight: 1.6 }}>
                  Connect your Sui wallet to access your Vitalis account. If you have a ClientNFT, you'll be automatically logged in.
                </Text>
              </Flex>

              <Box
                style={{
                  padding: "2rem",
                  background: "var(--accent-very-light)",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <ConnectButton 
                  style={{
                    width: "100%",
                  }}
                />
              </Box>

              {account && (
                <Box
                  style={{
                    padding: "1rem",
                    background: "rgba(76, 175, 80, 0.1)",
                    borderRadius: "var(--border-radius-sm)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <Text size="2" style={{ color: "#4caf50", fontWeight: 500 }}>
                    ✓ Wallet connected! Checking for your account...
                  </Text>
                </Box>
              )}

              <Button
                size="3"
                onClick={() => setShowLoginModal(false)}
                style={{
                  background: "transparent",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  borderRadius: "var(--border-radius-sm)",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 400,
                  transition: "var(--transition)",
                }}
              >
                Cancel
              </Button>
            </Flex>
          </Card>
        </Box>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowContactForm(false)}
        >
          <Card
            style={{
              maxWidth: "500px",
              width: "90%",
              padding: "2.5rem",
              background: "var(--secondary-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius-lg)",
              boxShadow: "var(--box-shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Flex direction="column" gap="2rem">
              <Flex direction="column" gap="1rem">
                <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                  Contact Us
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)", lineHeight: 1.6 }}>
                  Get in touch with our team. Fill out the form below and we'll get back to you soon.
                </Text>
              </Flex>

              <Flex direction="column" gap="1.5rem">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactFormData.name}
                  onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactFormData.email}
                  onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                  }}
                />
                <textarea
                  placeholder="Your Message"
                  value={contactFormData.message}
                  onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                />
              </Flex>

              <Flex gap="1rem">
                <Button
                  size="3"
                  onClick={() => {
                    setContactFormData({ name: "", email: "", message: "" });
                    setShowContactForm(false);
                  }}
                  style={{
                    background: "var(--accent-gradient)",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "var(--border-radius-sm)",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 500,
                    transition: "var(--transition)",
                    flex: 1,
                  }}
                >
                  Send Message
                </Button>
                <Button
                  size="3"
                  onClick={() => setShowContactForm(false)}
                  style={{
                    background: "transparent",
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                    borderRadius: "var(--border-radius-sm)",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 400,
                    transition: "var(--transition)",
                  }}
                >
                  Close
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Box>
      )}
    </Box>
  );
}
