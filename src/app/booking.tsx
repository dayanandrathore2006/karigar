import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.29.46:5000";

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const karigarName = String(
    params.karigarName || "Karigar"
  );

  const skill = String(
    params.skill || "Worker"
  );

  const rate = String(
    params.rate || "0"
  );

  const karigarId = String(
    params.karigarId || ""
  );

  const handleBooking = async () => {
    // Validate fields
    if (!date.trim() || !time.trim() || !address.trim()) {
      Alert.alert(
        "Missing Details",
        "Date, time aur address bharna zaroori hai."
      );
      return;
    }

    if (!karigarId) {
      Alert.alert(
        "Error",
        "Karigar information nahi mili."
      );
      return;
    }

    try {
      setLoading(true);

      // Get logged-in customer
      const savedUser = await AsyncStorage.getItem("user");

      if (!savedUser) {
        Alert.alert(
          "Login Required",
          "Please login karke booking karein.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ]
        );

        return;
      }

      const user = JSON.parse(savedUser);

      if (!user.id) {
        Alert.alert(
          "User Error",
          "Customer ID nahi mili. Please dobara login karein."
        );
        return;
      }

      console.log("Creating Booking...");

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: user.id,
            karigarId: karigarId,
            skill: skill,
            date: date.trim(),
            time: time.trim(),
            address: address.trim(),
            description: description.trim(),
            amount: Number(rate) || 0,
          }),
        }
      );

      const data = await response.json();

      console.log("Booking Response:", data);

      if (data.success) {
        Alert.alert(
          "Booking Confirmed 🎉",
          `${karigarName} "Booking request has been sent successfully."`,
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/customer");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Booking Failed",
          data.message ||
            "Booking create nahi ho paayi."
        );
      }
    } catch (error) {
      console.error(
        "Booking Error:",
        error
      );

      Alert.alert(
        "Connection Error",
        "Backend se connect nahi ho pa raha. Check karo ki backend aur phone same Wi-Fi par hain."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Book Karigar
          </Text>

          <Text style={styles.subtitle}>
            Enter your work details
          </Text>
        </View>
      </View>

      {/* Karigar Card */}

      <View style={styles.karigarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {karigarName
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>

        <View style={styles.karigarInfo}>
          <Text style={styles.karigarName}>
            {karigarName}
          </Text>

          <Text style={styles.skill}>
            {skill}
          </Text>

          <Text style={styles.rate}>
            Starting from ₹{rate}
          </Text>
        </View>
      </View>

      {/* Work Date */}

      <Text style={styles.label}>
        Work Date *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Example: 25/09/2026"
        placeholderTextColor="#9CA3AF"
        value={date}
        onChangeText={setDate}
      />

      {/* Work Time */}

      <Text style={styles.label}>
        Work Time *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Example: 10:00 AM"
        placeholderTextColor="#9CA3AF"
        value={time}
        onChangeText={setTime}
      />

      {/* Address */}

      <Text style={styles.label}>
        Work Address *
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.addressInput,
        ]}
        placeholder="Enter complete work address"
        placeholderTextColor="#9CA3AF"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Description */}

      <Text style={styles.label}>
        Work Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
        ]}
        placeholder="Example: Fan installation, wiring etc."
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Price Card */}

      <View style={styles.priceCard}>
        <Text style={styles.priceTitle}>
          💰 Estimated Starting Rate
        </Text>

        <Text style={styles.price}>
          ₹{rate}
        </Text>

        <Text style={styles.priceNote}>
          Final amount can depend on the work.
        </Text>
      </View>

      {/* Confirm Button */}

      <TouchableOpacity
        style={[
          styles.confirmButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleBooking}
        disabled={loading}
      >
        {loading ? (
          <>
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

            <Text style={styles.loadingText}>
              CREATING BOOKING...
            </Text>
          </>
        ) : (
          <Text style={styles.confirmText}>
            CONFIRM BOOKING
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        * Required fields
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  backText: {
    fontSize: 34,
    color: "#1F2937",
    marginTop: -4,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  karigarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFF1E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  avatarText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#FF6B00",
  },

  karigarInfo: {
    flex: 1,
  },

  karigarName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
  },

  skill: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 3,
  },

  rate: {
    fontSize: 13,
    color: "#FF6B00",
    fontWeight: "700",
    marginTop: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 18,
  },

  addressInput: {
    height: 90,
    paddingTop: 15,
  },

  descriptionInput: {
    height: 100,
    paddingTop: 15,
  },

  priceCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
  },

  priceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },

  price: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FF6B00",
    marginTop: 5,
  },

  priceNote: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  confirmButton: {
    backgroundColor: "#FF6B00",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  disabledButton: {
    opacity: 0.7,
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 10,
  },

  note: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 12,
  },
});