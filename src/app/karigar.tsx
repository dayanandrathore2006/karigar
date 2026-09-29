import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://https://karigar-4fu2.onrender.com29.46:5000";

type Booking = {
  _id: string;
  skill: string;
  date: string;
  time: string;
  address: string;
  description?: string;
  amount?: number;
  status: string;
  customer?: {
    _id?: string;
    name?: string;
    mobile?: string;
    email?: string;
  };
};

export default function KarigarScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [requests, setRequests] = useState<Booking[]>([]);
  const [activeJobs, setActiveJobs] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        Alert.alert(
          "Login Required",
          "Please login again."
        );
        router.replace("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (!parsedUser.id) {
        Alert.alert(
          "User Error",
          "Karigar ID was not found. Please login again."
        );
        return;
      }

      // -----------------------------
      // FETCH PENDING REQUESTS
      // -----------------------------
      const requestResponse = await fetch(
        `${API_URL}/api/bookings/karigar/${parsedUser.id}`
      );

      const requestData = await requestResponse.json();

      if (requestData.success) {
        setRequests(requestData.bookings || []);
      } else {
        setRequests([]);
      }

      // -----------------------------
      // FETCH ACTIVE JOBS
      // -----------------------------
      const activeResponse = await fetch(
        `${API_URL}/api/bookings/karigar/${parsedUser.id}/active`
      );

      const activeData = await activeResponse.json();

      if (activeData.success) {
        setActiveJobs(activeData.bookings || []);
      } else {
        setActiveJobs([]);
      }
    } catch (error) {
      console.error("Karigar Data Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to load booking information."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // -----------------------------
  // ACCEPT BOOKING
  // -----------------------------
  const acceptBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Booking Accepted",
          "The booking has been accepted successfully."
        );

        await loadData();
      } else {
        Alert.alert(
          "Unable to Accept",
          data.message || "Unable to accept booking."
        );
      }
    } catch (error) {
      console.error("Accept Booking Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the backend."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // REJECT BOOKING
  // -----------------------------
  const rejectBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Booking Rejected",
          "The booking request has been rejected."
        );

        await loadData();
      } else {
        Alert.alert(
          "Unable to Reject",
          data.message || "Unable to reject booking."
        );
      }
    } catch (error) {
      console.error("Reject Booking Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the backend."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // START WORK
  // -----------------------------
  const startWork = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/start`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Work Started",
          "You have started this job."
        );

        await loadData();
      } else {
        Alert.alert(
          "Unable to Start",
          data.message || "Unable to start work."
        );
      }
    } catch (error) {
      console.error("Start Work Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the backend."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // COMPLETE WORK
  // -----------------------------
  const completeWork = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Work Completed",
          "The job has been marked as completed."
        );

        await loadData();
      } else {
        Alert.alert(
          "Unable to Complete",
          data.message || "Unable to complete work."
        );
      }
    } catch (error) {
      console.error("Complete Work Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the backend."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  // -----------------------------
  // BOOKING REQUEST CARD
  // -----------------------------
  const renderRequest = (booking: Booking) => {
    const customerName =
      booking.customer?.name || "Customer";

    const isProcessing =
      actionLoading === booking._id;

    return (
      <View style={styles.card} key={booking._id}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.skill}>
              {booking.skill}
            </Text>

            <Text style={styles.requestLabel}>
              New Booking Request
            </Text>
          </View>

          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>
              PENDING
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.detail}>
          👤 Customer:{" "}
          <Text style={styles.detailValue}>
            {customerName}
          </Text>
        </Text>

        {booking.customer?.mobile && (
          <Text style={styles.detail}>
            📱 Mobile:{" "}
            <Text style={styles.detailValue}>
              {booking.customer.mobile}
            </Text>
          </Text>
        )}

        <Text style={styles.detail}>
          📅 Date:{" "}
          <Text style={styles.detailValue}>
            {booking.date}
          </Text>
        </Text>

        <Text style={styles.detail}>
          ⏰ Time:{" "}
          <Text style={styles.detailValue}>
            {booking.time}
          </Text>
        </Text>

        <Text style={styles.detail}>
          📍 Address:{" "}
          <Text style={styles.detailValue}>
            {booking.address}
          </Text>
        </Text>

        {booking.description ? (
          <Text style={styles.detail}>
            📝 Description:{" "}
            <Text style={styles.detailValue}>
              {booking.description}
            </Text>
          </Text>
        ) : null}

        <Text style={styles.amount}>
          ₹{booking.amount || 0}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.rejectButton,
              isProcessing && styles.disabledButton,
            ]}
            disabled={isProcessing}
            onPress={() => rejectBooking(booking._id)}
          >
            <Text style={styles.rejectText}>
              REJECT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              isProcessing && styles.disabledButton,
            ]}
            disabled={isProcessing}
            onPress={() => acceptBooking(booking._id)}
          >
            <Text style={styles.acceptText}>
              {isProcessing
                ? "PROCESSING..."
                : "ACCEPT"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // -----------------------------
  // ACTIVE JOB CARD
  // -----------------------------
  const renderActiveJob = (booking: Booking) => {
    const isProcessing =
      actionLoading === booking._id;

    return (
      <View style={styles.card} key={booking._id}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.skill}>
              {booking.skill}
            </Text>

            <Text style={styles.customerName}>
              {booking.customer?.name || "Customer"}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              booking.status === "started"
                ? styles.startedBadge
                : styles.acceptedBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.detail}>
          📅 Date:{" "}
          <Text style={styles.detailValue}>
            {booking.date}
          </Text>
        </Text>

        <Text style={styles.detail}>
          ⏰ Time:{" "}
          <Text style={styles.detailValue}>
            {booking.time}
          </Text>
        </Text>

        <Text style={styles.detail}>
          📍 Address:{" "}
          <Text style={styles.detailValue}>
            {booking.address}
          </Text>
        </Text>

        {booking.description ? (
          <Text style={styles.detail}>
            📝 Description:{" "}
            <Text style={styles.detailValue}>
              {booking.description}
            </Text>
          </Text>
        ) : null}

        <Text style={styles.amount}>
          ₹{booking.amount || 0}
        </Text>

        {booking.status === "accepted" && (
          <TouchableOpacity
            style={[
              styles.startButton,
              isProcessing && styles.disabledButton,
            ]}
            disabled={isProcessing}
            onPress={() => startWork(booking._id)}
          >
            <Text style={styles.buttonText}>
              {isProcessing
                ? "STARTING..."
                : "START WORK"}
            </Text>
          </TouchableOpacity>
        )}

        {booking.status === "started" && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              isProcessing && styles.disabledButton,
            ]}
            disabled={isProcessing}
            onPress={() => completeWork(booking._id)}
          >
            <Text style={styles.buttonText}>
              {isProcessing
                ? "COMPLETING..."
                : "COMPLETE WORK"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>
              Welcome 👋
            </Text>

            <Text style={styles.name}>
              {user?.name || "Karigar"}
            </Text>

            <Text style={styles.role}>
              KARIGAR Worker
            </Text>
          </View>

          <View style={styles.profileIcon}>
            <Text style={styles.profileEmoji}>
              🛠️
            </Text>
          </View>
        </View>

        {/* AVAILABILITY */}
        <View style={styles.availabilityCard}>
          <View>
            <Text style={styles.availabilityTitle}>
              You are Available
            </Text>

            <Text style={styles.availabilitySub}>
              You can receive new booking requests.
            </Text>
          </View>

          <View style={styles.onlineDot} />
        </View>

        {/* REQUEST SUMMARY */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {requests.length}
            </Text>

            <Text style={styles.summaryLabel}>
              New Requests
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {activeJobs.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Active Jobs
            </Text>
          </View>
        </View>

        {/* BOOKING REQUESTS */}
        <Text style={styles.sectionTitle}>
          Booking Requests
        </Text>

        {requests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📭
            </Text>

            <Text style={styles.emptyTitle}>
              No New Booking Requests
            </Text>

            <Text style={styles.emptyText}>
              New customer booking requests will appear here.
            </Text>
          </View>
        ) : (
          requests.map(renderRequest)
        )}

        {/* ACTIVE JOBS */}
        <Text style={styles.sectionTitle}>
          Active Jobs
        </Text>

        {activeJobs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              🔧
            </Text>

            <Text style={styles.emptyTitle}>
              No Active Jobs
            </Text>

            <Text style={styles.emptyText}>
              Accepted jobs will appear here.
            </Text>
          </View>
        ) : (
          activeJobs.map(renderActiveJob)
        )}

        {/* REFRESH */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadData}
        >
          <Text style={styles.refreshText}>
            REFRESH
          </Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>
            LOGOUT
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  scrollContent: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcome: {
    fontSize: 16,
    color: "#6B7280",
  },

  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 2,
  },

  role: {
    fontSize: 14,
    color: "#FF6B00",
    fontWeight: "700",
    marginTop: 3,
  },

  profileIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
  },

  profileEmoji: {
    fontSize: 28,
  },

  availabilityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    elevation: 2,
  },

  availabilityTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
  },

  availabilitySub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 5,
  },

  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
    elevation: 2,
  },

  summaryNumber: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FF6B00",
  },

  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 5,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  skill: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
  },

  requestLabel: {
    fontSize: 12,
    color: "#FF6B00",
    fontWeight: "700",
    marginTop: 3,
  },

  customerName: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  pendingBadge: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  pendingText: {
    color: "#EA580C",
    fontSize: 11,
    fontWeight: "800",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  acceptedBadge: {
    backgroundColor: "#EFF6FF",
  },

  startedBadge: {
    backgroundColor: "#ECFDF5",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#374151",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  detail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },

  detailValue: {
    color: "#1F2937",
    fontWeight: "600",
  },

  amount: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF6B00",
    marginTop: 5,
    marginBottom: 14,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
  },

  rejectButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },

  rejectText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 14,
  },

  acceptButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },

  acceptText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  startButton: {
    backgroundColor: "#FF6B00",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  completeButton: {
    backgroundColor: "#16A34A",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.5,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 35,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },

  refreshButton: {
    backgroundColor: "#1F2937",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  refreshText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  logoutButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  logoutText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 14,
  },
});