import { useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  Badge,
  Dialog,
  TextField,
} from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { businesses, type Business } from "../businesses";
import { getClientData, saveReservation, saveClientData } from "../clientStorage";
import { useVitalisTransactions } from "../useVitalisTransactions";
import { VITALIS_PACKAGE_ID } from "../config";

interface BookingState {
  businessId: string | null;
  serviceId: string | null;
  providerId: string | null;
  date: string;
  time: string;
}

interface WeeklyCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

function WeeklyCalendar({ selectedDate, onSelectDate }: WeeklyCalendarProps) {
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });

  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays(weekStart);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isDateInPast = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    if (!isDateInPast(newStart)) {
      setWeekStart(newStart);
    }
  };

  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Flex direction="column" gap="3">
      <Flex justify="between" align="center" style={{ padding: "0 0.5rem" }}>
        <Box
          onClick={goToPreviousWeek}
          style={{
            background: "transparent",
            border: "1px solid var(--border-color)",
            cursor: isDateInPast(weekDays[0]) ? "not-allowed" : "pointer",
            opacity: isDateInPast(weekDays[0]) ? 0.5 : 1,
            padding: "0.5rem",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isDateInPast(weekDays[0])) {
              e.currentTarget.style.background = "var(--accent-very-light)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <ChevronLeft size={20} color="var(--accent-primary)" />
        </Box>
        <Text size="3" weight="bold" style={{ textAlign: "center", minWidth: "150px" }}>
          {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {" "}
          {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </Text>
        <Box
          onClick={goToNextWeek}
          style={{
            background: "transparent",
            border: "1px solid var(--border-color)",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-very-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <ChevronRight size={20} color="var(--accent-primary)" />
        </Box>
      </Flex>

      <Flex gap="0.75rem" justify="center" style={{ flexWrap: "wrap" }}>
        {weekDays.map((date) => {
          const dateStr = formatDate(date);
          const isPast = isDateInPast(date);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === formatDate(today);

          return (
            <Box
              key={dateStr}
              onClick={() => !isPast && onSelectDate(dateStr)}
              style={{
                padding: "0.75rem 0.875rem",
                borderRadius: "12px",
                border: isSelected ? "2px solid var(--accent-primary)" : isToday ? "2px solid var(--accent-primary)" : isPast ? "1px solid #ddd" : "1px solid var(--border-color)",
                background: isSelected
                  ? "var(--accent-gradient)"
                  : isToday
                  ? "var(--secondary-bg)"
                  : isPast
                  ? "#f5f5f5"
                  : "var(--secondary-bg)",
                cursor: isPast ? "not-allowed" : "pointer",
                opacity: isPast ? 0.6 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.2s ease",
                minWidth: "65px",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                if (!isPast) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(176, 70, 162, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Text
                size="2"
                weight="medium"
                style={{
                  color: isSelected ? "white" : isPast ? "#999" : "var(--text-color)",
                }}
              >
                {dayNames[date.getDay()]}
              </Text>
              <Text
                weight="bold"
                style={{
                  fontSize: "1.1rem",
                  color: isSelected ? "white" : isPast ? "#999" : "var(--text-color)",
                }}
              >
                {date.getDate()}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
}

export function BusinessesPage() {
  const { createReservation, txInProgress } = useVitalisTransactions();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const client = getClientData();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [booking, setBooking] = useState<BookingState>({
    businessId: null,
    serviceId: null,
    providerId: null,
    date: "",
    time: "",
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"service" | "provider" | "date" | "time" | "confirm">("service");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter businesses and services based on search query
  const filteredBusinesses = businesses.filter((business) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesBusinessName = business.name.toLowerCase().includes(query);
    const matchesCategory = business.category.toLowerCase().includes(query);
    const matchesDescription = business.description.toLowerCase().includes(query);
    const matchesLocation = business.location.toLowerCase().includes(query);
    const matchesService = business.services.some(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
    
    return matchesBusinessName || matchesCategory || matchesDescription || matchesLocation || matchesService;
  });

  const handleStartBooking = (business: Business) => {
    setSelectedBusiness(business);
    setBooking({ businessId: business.id, serviceId: null, providerId: null, date: "", time: "" });
    setBookingStep("service");
    setIsBookingOpen(true);
    setError(null);
  };

  const handleSelectService = (serviceId: string) => {
    setBooking({ ...booking, serviceId });
    setBookingStep("provider");
    setError(null);
  };

  const handleSelectProvider = (providerId?: string) => {
    setBooking({ ...booking, providerId: providerId || null });
    setBookingStep("date");
    setError(null);
  };

  const handleSelectDate = () => {
    if (!booking.date) {
      setError("Please select a date");
      return;
    }
    setBookingStep("time");
    setError(null);
  };

  const handleSelectTime = () => {
    if (!booking.time) {
      setError("Please select a time");
      return;
    }
    setBookingStep("confirm");
    setError(null);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!booking.businessId || !booking.serviceId || !booking.date || !booking.time) {
        setError("Missing booking details");
        return;
      }

      const business = businesses.find((b) => b.id === booking.businessId);
      const service = business?.services.find((s) => s.id === booking.serviceId);
      if (!business || !service) {
        setError("Unable to locate the selected business or service");
        return;
      }

      if (!account?.address) {
        setError("Connect your wallet to book an appointment");
        return;
      }

      // Resolve the current ClientNFT ID from chain (handles new package deployments)
      const resolvedClientId = await (async () => {
        const res = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: { StructType: `${VITALIS_PACKAGE_ID}::vitalis_identity::ClientNFT` },
          options: { showType: true },
          limit: 1,
        });
        const objId = res.data[0]?.data?.objectId;
        if (objId && client?.id !== objId) {
          saveClientData({ ...(client || { wallet: account.address, display_name: "User", email: "", created_at: Date.now() } as any), id: objId });
        }
        return objId;
      })();

      if (!resolvedClientId) {
        setError("No Client NFT found on this wallet. Please register again.");
        return;
      }

      const chosenProvider = booking.providerId
        ? business.providers.find((p) => p.id === booking.providerId)
        : business.providers.find((p) => p.onChainId) || business.providers[0];

      setError(null);

      const { appointmentId } = await createReservation({
        clientId: resolvedClientId,
        timeSlot: booking.time,
        date: booking.date,
        durationMinutes: service.duration,
        providerName: chosenProvider?.name || "Any available provider",
      });

      const reservation = {
        id: appointmentId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appointmentId: appointmentId || undefined,
        businessId: booking.businessId,
        serviceId: booking.serviceId,
        providerId: booking.providerId || chosenProvider?.id || undefined,
        providerName: chosenProvider?.name || "Any available provider",
        date: booking.date,
        timeSlot: booking.time,
        status: "confirmed" as const,
        createdAt: Date.now(),
      };

      await saveReservation(reservation);

      setSuccess(`Booking confirmed for ${business.name}!`);
      setIsBookingOpen(false);
      setBooking({ businessId: null, serviceId: null, providerId: null, date: "", time: "" });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save booking");
    }
  };

  const currentBusiness = booking.businessId
    ? businesses.find((b) => b.id === booking.businessId)
    : null;
  const currentService = currentBusiness?.services.find((s) => s.id === booking.serviceId);

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  if (!client) {
    return (
      <Box style={{ padding: "2rem", textAlign: "center" }}>
        <Heading size="6">Connect your wallet to book</Heading>
        <Text color="gray">Please connect your wallet to create an on-chain reservation.</Text>
      </Box>
    );
  }

  return (
    <Box>
      {success && (
        <Box
          style={{
            padding: "1rem",
            background: "#D4EDDA",
            color: "#155724",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          <Text size="2" weight="bold">
            {success}
          </Text>
        </Box>
      )}

      <Heading size="7" style={{ marginBottom: "1rem" }}>
        ✨ Beauty & Wellness Businesses
      </Heading>

      {/* Search Bar */}
      <Flex
        align="center"
        gap="2"
        style={{
          marginBottom: "2rem",
          padding: "0.75rem 1rem",
          background: "var(--secondary-bg)",
          borderRadius: "12px",
          border: "2px solid var(--border-color)",
          transition: "all 0.2s ease",
        }}
      >
        <Search size={20} color="var(--accent-primary)" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search businesses, services, or treatments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "1rem",
            fontFamily: "var(--font-body)",
            color: "var(--text-color)",
          }}
        />
        {searchQuery && (
          <Text
            size="2"
            style={{
              color: "var(--accent-primary)",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => setSearchQuery("")}
          >
            Clear
          </Text>
        )}
      </Flex>

      {filteredBusinesses.length === 0 ? (
        <Box
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "var(--secondary-bg)",
            borderRadius: "12px",
          }}
        >
          <Heading size="4" style={{ marginBottom: "0.5rem" }}>
            No results found
          </Heading>
          <Text size="3" style={{ color: "var(--text-light)" }}>
            Try searching for different keywords or clear your search
          </Text>
        </Box>
      ) : (
        <>
          <Text size="2" style={{ marginBottom: "1rem", color: "var(--text-light)" }}>
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? "business" : "businesses"} found
          </Text>

          <Flex
            gap="4"
            wrap="wrap"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredBusinesses.map((business) => (
          <Card
            key={business.id}
            style={{
              background: "white",
              boxShadow: "0 2px 12px rgba(176, 70, 162, 0.12)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "2px solid var(--accent-primary)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 20px rgba(176,70,162,0.25)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 12px rgba(176, 70, 162, 0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <Flex direction="column" gap="3" p="4" style={{ flex: 1 }}>
              <Flex justify="between" align="start">
                <Flex direction="column" gap="2" style={{ flex: 1 }}>
                  <Heading size="5" style={{ color: "var(--accent-primary)" }}>{business.name}</Heading>
                  <Text size="2" style={{ color: "#1a1a1a" }}>
                    {business.location}
                  </Text>
                  <Flex gap="2" align="center">
                    <Badge
                      style={{
                        background: "var(--accent-secondary)",
                        color: "white",
                      }}
                    >
                      ⭐ {business.rating} ({business.reviewCount} reviews)
                    </Badge>
                  </Flex>
                </Flex>
              </Flex>

              <Flex direction="column" gap="2">
                <Text weight="bold" size="2" style={{ color: "#1a1a1a" }}>
                  Services ({business.services.length}):
                </Text>
                <Flex direction="column" gap="1">
                  {business.services.slice(0, 3).map((service) => (
                    <Text key={service.id} size="2" style={{ color: "#666" }}>
                      • {service.name} - {service.price} RON
                    </Text>
                  ))}
                  {business.services.length > 3 && (
                    <Text size="2" style={{ fontStyle: "italic", color: "#666" }}>
                      + {business.services.length - 3} more...
                    </Text>
                  )}
                </Flex>
              </Flex>

              <Flex direction="column" gap="2">
                <Text weight="bold" size="2" style={{ color: "#1a1a1a" }}>
                  Available Providers: {business.providers.length}
                </Text>
              </Flex>

              <Button
                onClick={() => handleStartBooking(business)}
                size="3"
                style={{
                  background: "var(--accent-gradient)",
                  color: "white",
                  marginTop: "auto",
                  transition: "var(--transition)",
                  border: "none",
                  boxShadow: "var(--box-shadow-sm)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                }}
              >
                Book Now
              </Button>
            </Flex>
          </Card>
        ))}
          </Flex>
        </>
      )}

      {/* Booking Dialog */}
      <Dialog.Root open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <Dialog.Content maxWidth="500px" style={{ maxHeight: "80vh", overflow: "auto" }}>
          <Dialog.Title>
            {selectedBusiness?.name} - {["Service", "Provider", "Date", "Time", "Confirm"][["service", "provider", "date", "time", "confirm"].indexOf(bookingStep)]}
          </Dialog.Title>

          <Flex direction="column" gap="4">
            {/* Step 1: Service Selection */}
            {bookingStep === "service" && currentBusiness && (
              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  Choose a service
                </Text>
                <Flex direction="column" gap="2">
                  {currentBusiness.services.map((service) => (
                    <Box
                      key={service.id}
                      onClick={() => handleSelectService(service.id)}
                      style={{
                        padding: "1rem",
                        borderRadius: "8px",
                        border:
                          booking.serviceId === service.id
                            ? "2px solid var(--accent-primary)"
                            : "1px solid var(--border-color)",
                        background:
                          booking.serviceId === service.id ? "var(--accent-very-light)" : "var(--secondary-bg)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Text weight="bold" size="2">
                            {service.name}
                          </Text>
                          <Text size="2" color="gray">
                            {service.description}
                          </Text>
                          <Text size="1" color="gray">
                            {service.duration} min
                          </Text>
                        </Flex>
                        <Text weight="bold" style={{ color: "var(--accent-secondary)" }}>
                          {service.price} RON
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Step 2: Provider Selection (Optional) */}
            {bookingStep === "provider" && currentBusiness && (
              <Flex direction="column" gap="3">
                <Text size="2" style={{ color: "#666" }}>
                  Choose a provider (optional)
                </Text>
                <Flex direction="column" gap="2">
                  <Box
                    onClick={() => handleSelectProvider()}
                    style={{
                      padding: "1rem",
                      borderRadius: "8px",
                      border:
                        booking.providerId === null
                          ? "2px solid var(--accent-primary)"
                          : "1px solid var(--border-color)",
                      background: booking.providerId === null ? "var(--accent-very-light)" : "var(--secondary-bg)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Text weight="bold" size="2">
                      No preference (any available)
                    </Text>
                  </Box>
                  {currentBusiness.providers.map((provider) => (
                    <Box
                      key={provider.id}
                      onClick={() => handleSelectProvider(provider.id)}
                      style={{
                        padding: "1rem",
                        borderRadius: "8px",
                        border:
                          booking.providerId === provider.id
                            ? "2px solid var(--accent-primary)"
                            : "1px solid var(--border-color)",
                        background:
                          booking.providerId === provider.id ? "var(--accent-very-light)" : "var(--secondary-bg)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Text weight="bold" size="2">
                            {provider.name}
                          </Text>
                          <Text size="2" style={{ color: "#666" }}>
                            {provider.specialty}
                          </Text>
                          <Badge
                            style={{
                              background: "var(--accent-secondary)",
                              color: "white",
                              width: "fit-content",
                            }}
                          >
                            ⭐ {provider.rating}
                          </Badge>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Step 3: Date Selection - Weekly Calendar */}
            {bookingStep === "date" && currentService && (
              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  Choose a date for {currentService.name}
                </Text>
                <WeeklyCalendar 
                  selectedDate={booking.date} 
                  onSelectDate={(date) => setBooking({ ...booking, date })}
                />
              </Flex>
            )}

            {/* Step 3: Time Selection */}
            {bookingStep === "time" && (
              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  Choose a time slot
                </Text>
                <Flex direction="column" gap="2" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {timeSlots.map((slot) => (
                    <Box
                      key={slot}
                      onClick={() => setBooking({ ...booking, time: slot })}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border:
                          booking.time === slot
                            ? "2px solid var(--accent-primary)"
                            : "1px solid var(--border-color)",
                        background: booking.time === slot ? "var(--accent-very-light)" : "var(--secondary-bg)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Text size="2" weight={booking.time === slot ? "bold" : "regular"}>
                        {slot}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Step 4: Confirmation */}
            {bookingStep === "confirm" && currentBusiness && currentService && (
              <Flex direction="column" gap="3">
                <Box
                  style={{
                    background: "#F8F8F8",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <Flex direction="column" gap="2">
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Business:
                      </Text>
                      <Text size="2">{currentBusiness.name}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Service:
                      </Text>
                      <Text size="2">{currentService.name}</Text>
                    </Flex>
                    {booking.providerId && (
                      <Flex justify="between">
                        <Text weight="bold" size="2">
                          Provider:
                        </Text>
                        <Text size="2">
                          {currentBusiness.providers.find(p => p.id === booking.providerId)?.name || "Any available"}
                        </Text>
                      </Flex>
                    )}
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Date:
                      </Text>
                      <Text size="2">{booking.date}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Time:
                      </Text>
                      <Text size="2">{booking.time}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Price:
                      </Text>
                      <Text weight="bold" style={{ color: "var(--accent-secondary)" }}>
                        {currentService.price} RON
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            )}

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            <Flex gap="2" justify="end">
              {bookingStep !== "service" && (
                <Button
                  onClick={() => {
                    const steps: ("service" | "provider" | "date" | "time" | "confirm")[] = [
                      "service",
                      "provider",
                      "date",
                      "time",
                      "confirm",
                    ];
                    const currentIndex = steps.indexOf(bookingStep);
                    if (currentIndex > 0) {
                      setBookingStep(steps[currentIndex - 1]);
                      setError(null);
                    }
                  }}
                  variant="soft"
                >
                  Back
                </Button>
              )}

              {bookingStep === "service" && (
                <Button
                  onClick={() => {
                    if (!booking.serviceId) {
                      setError("Please select a service");
                      return;
                    }
                    setBookingStep("provider");
                  }}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "provider" && (
                <Button
                  onClick={() => {
                    setBookingStep("date");
                  }}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "date" && (
                <Button
                  onClick={handleSelectDate}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "time" && (
                <Button
                  onClick={handleSelectTime}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "confirm" && (
                <Button
                  onClick={handleConfirmBooking}
                  disabled={txInProgress}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  {txInProgress ? "Confirming..." : "Confirm Booking"}
                </Button>
              )}
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
