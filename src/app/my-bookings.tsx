import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://https://karigar-4fu2.onrender.com29.46:5000";

type Booking = {
  _id: string;
  skill: string;
  date: string;
  time: string;
  address: string;
  description?: string;
  amount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  rating: number;
  review?: string;
  karigar?: {
    name: string;
    mobile: string;
    skill: string;
    experience: number;
    rate: number;
    rating: number;
  };
};

export default function MyBookingsScreen() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [ratingBooking, setRatingBooking] =
    useState<string | null>(null);

  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");

  const loadBookings = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");

      if (!savedUser) {
        Alert.alert(
          "Login Required",
          "Please login again."
        );
        router.replace("/login");
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        `${API_URL}/api/bookings/customer/${user.id}`
      );

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        Alert.alert(
          "Error",
          data.message || "Unable to load bookings."
        );
      }
    } catch (error) {
      console.error("My Bookings Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#F59E0B";

      case "accepted":
        return "#16A34A";

      case "started":
        return "#2563EB";

      case "completed":
        return "#7C3AED";

      case "rejected":
        return "#DC2626";

      default:
        return "#6B7280";
    }
  };

  const handlePayment = (booking: Booking) => {
    Alert.alert(
      "Payment",
      `Pay ₹${booking.amount} for ${booking.skill}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Pay Now",
          onPress: () => processPayment(booking._id),
        },
      ]
    );
  };

  const processPayment = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "Demo Payment",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Payment Successful 🎉",
          "Your payment has been completed successfully.",
          [
            {
              text: "OK",
              onPress: () => loadBookings(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Payment Failed",
          data.message || "Unable to complete payment."
        );
      }
    } catch (error) {
      console.error("Payment Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to process payment."
      );
    }
  };

  const submitRating = async (bookingId: string) => {
    if (selectedRating === 0) {
      Alert.alert(
        "Rating Required",
        "Please select a rating from 1 to 5 stars."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: selectedRating,
            review: review.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Thank You ⭐",
          "Your rating has been submitted successfully."
        );

        setRatingBooking(null);
        setSelectedRating(0);
        setReview("");

        loadBookings();
      } else {
        Alert.alert(
          "Rating Failed",
          data.message || "Unable to submit rating."
        );
      }
    } catch (error) {
      console.error("Rating Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to submit rating."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            My Bookings
          </Text>

          <Text style={styles.headerSubtitle}>
            Track your service requests
          </Text>
        </View>

        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator
              size="large"
              color="#FF6B00"
            />

            <Text style={styles.loadingText}>
              Loading bookings...
            </Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>

            <Text style={styles.emptyTitle}>
              No Bookings Yet
            </Text>

            <Text style={styles.emptyText}>
              Your bookings will appear here after you book
              a karigar.
            </Text>

            <TouchableOpacity
              style={styles.findButton}
              onPress={() =>
                router.replace("/customer")
              }
            >
              <Text style={styles.findButtonText}>
                FIND A KARIGAR
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((booking) => (
            <View
              key={booking._id}
              style={styles.bookingCard}
            >
              {/* TOP */}
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.skill}>
                    {booking.skill}
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      {
                        color: getStatusColor(
                          booking.status
                        ),
                      },
                    ]}
                  >
                    {booking.status
                      .replace("_", " ")
                      .toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.amount}>
                  ₹{booking.amount}
                </Text>
              </View>

              {/* KARIGAR */}
              <View style={styles.detailRow}>
                <Text style={styles.icon}>👷</Text>

                <View style={styles.detailContent}>
                  <Text style={styles.label}>
                    Karigar
                  </Text>

                  <Text style={styles.value}>
                    {booking.karigar?.name ||
                      "Karigar"}
                  </Text>

                  {booking.karigar?.rating ? (
                    <Text style={styles.ratingSmall}>
                      ⭐ {booking.karigar.rating}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* DATE */}
              <View style={styles.detailRow}>
                <Text style={styles.icon}>📅</Text>

                <View style={styles.detailContent}>
                  <Text style={styles.label}>
                    Date & Time
                  </Text>

                  <Text style={styles.value}>
                    {booking.date} • {booking.time}
                  </Text>
                </View>
              </View>

              {/* ADDRESS */}
              <View style={styles.detailRow}>
                <Text style={styles.icon}>📍</Text>

                <View style={styles.detailContent}>
                  <Text style={styles.label}>
                    Address
                  </Text>

                  <Text style={styles.value}>
                    {booking.address}
                  </Text>
                </View>
              </View>

              {/* STATUS MESSAGE */}
              {booking.status === "accepted" && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>
                    ✓ Your karigar has accepted the booking.
                  </Text>
                </View>
              )}

              {booking.status === "started" && (
                <View style={styles.startedBox}>
                  <Text style={styles.startedText}>
                    🔧 Your work is currently in progress.
                  </Text>
                </View>
              )}

              {booking.status === "completed" && (
                <View style={styles.completedBox}>
                  <Text style={styles.completedText}>
                    ✓ Work has been completed.
                  </Text>
                </View>
              )}

              {/* PAYMENT */}
              {booking.status === "completed" &&
                booking.paymentStatus !== "paid" && (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() =>
                      handlePayment(booking)
                    }
                  >
                    <Text style={styles.payButtonText}>
                      PAY ₹{booking.amount}
                    </Text>
                  </TouchableOpacity>
                )}

              {booking.paymentStatus === "paid" && (
                <View style={styles.paidBox}>
                  <Text style={styles.paidText}>
                    ✓ Payment Completed
                  </Text>
                </View>
              )}

              {/* RATE BUTTON */}
              {booking.status === "completed" &&
                booking.rating === 0 && (
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => {
                      setRatingBooking(booking._id);
                      setSelectedRating(0);
                      setReview("");
                    }}
                  >
                    <Text style={styles.rateButtonText}>
                      ⭐ RATE KARIGAR
                    </Text>
                  </TouchableOpacity>
                )}

              {/* RATING FORM */}
              {ratingBooking === booking._id && (
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingTitle}>
                    Rate Your Experience
                  </Text>

                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setSelectedRating(star)
                        }
                      >
                        <Text
                          style={[
                            styles.star,
                            {
                              opacity:
                                selectedRating >= star
                                  ? 1
                                  : 0.3,
                            },
                          ]}
                        >
                          ★
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    style={styles.reviewInput}
                    placeholder="Write a review (optional)"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    value={review}
                    onChangeText={setReview}
                  />

                  <View style={styles.ratingActions}>
                    <TouchableOpacity
                      style={styles.cancelRatingButton}
                      onPress={() => {
                        setRatingBooking(null);
                        setSelectedRating(0);
                        setReview("");
                      }}
                    >
                      <Text
                        style={styles.cancelRatingText}
                      >
                        CANCEL
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.submitRatingButton}
                      onPress={() =>
                        submitRating(booking._id)
                      }
                    >
                      <Text
                        style={styles.submitRatingText}
                      >
                        SUBMIT
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ALREADY RATED */}
              {booking.rating > 0 && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewTitle}>
                    Your Rating
                  </Text>

                  <Text style={styles.reviewStars}>
                    {"★".repeat(booking.rating)}
                    {"☆".repeat(5 - booking.rating)}
                  </Text>

                  {booking.review ? (
                    <Text style={styles.reviewText}>
                      "{booking.review}"
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          ))
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 32,
    color: "#374151",
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#1F2937",
  },

  headerSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  refreshText: {
    fontSize: 28,
    color: "#FF6B00",
  },

  scrollContent: {
    padding: 20,
  },

  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 35,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 13,
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 7,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },

  findButton: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
  },

  findButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  skill: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 4,
  },

  status: {
    fontSize: 10,
    fontWeight: "900",
  },

  amount: {
    fontSize: 19,
    fontWeight: "900",
    color: "#16A34A",
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  icon: {
    width: 32,
    fontSize: 18,
  },

  detailContent: {
    flex: 1,
  },

  label: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "700",
    marginBottom: 2,
  },

  value: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    lineHeight: 18,
  },

  ratingSmall: {
    fontSize: 11,
    color: "#F59E0B",
    marginTop: 2,
    fontWeight: "700",
  },

  successBox: {
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
  },

  successText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "700",
  },

  startedBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
  },

  startedText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "700",
  },

  completedBox: {
    backgroundColor: "#F5F3FF",
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
  },

  completedText: {
    color: "#6D28D9",
    fontSize: 12,
    fontWeight: "700",
  },

  payButton: {
    height: 50,
    borderRadius: 11,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  paidBox: {
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 5,
  },

  paidText: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "900",
  },

  rateButton: {
    height: 48,
    borderRadius: 11,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  rateButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  ratingBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },

  ratingTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 10,
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },

  star: {
    fontSize: 36,
    color: "#F59E0B",
    marginHorizontal: 4,
  },

  reviewInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 75,
    textAlignVertical: "top",
    color: "#1F2937",
    fontSize: 13,
  },

  ratingActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelRatingButton: {
    width: "48%",
    height: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelRatingText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
  },

  submitRatingButton: {
    width: "48%",
    height: 44,
    borderRadius: 9,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
  },

  submitRatingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  reviewBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 11,
    padding: 12,
    marginTop: 12,
  },

  reviewTitle: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "800",
    marginBottom: 4,
  },

  reviewStars: {
    color: "#F59E0B",
    fontSize: 19,
    letterSpacing: 2,
  },

  reviewText: {
    marginTop: 5,
    color: "#4B5563",
    fontSize: 12,
    lineHeight: 18,
  },

  bottomSpace: {
    height: 30,
  },
});