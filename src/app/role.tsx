import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.29.46:5000";

export default function RoleScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const registerUser = async (role: "customer" | "karigar") => {
    try {
      setLoading(true);

      const savedData = await AsyncStorage.getItem(
        "pendingRegistration"
      );

      if (!savedData) {
        Alert.alert(
          "Registration Error",
          "Registration details were not found. Please register again."
        );

        router.replace("/register");
        return;
      }

      const registrationData = JSON.parse(savedData);

      console.log("Registration Data:", registrationData);
      console.log("Registration Role:", role);
      console.log(
        "Registration API:",
        `${API_URL}/api/auth/register`
      );

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registrationData.name,
            mobile: registrationData.mobile,
            email: registrationData.email,
            password: registrationData.password,
            role: role,
          }),
        }
      );

      console.log("Registration Status:", response.status);

      const responseText = await response.text();

      console.log(
        "Registration Response:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid server response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        Alert.alert(
          "Registration Failed",
          data.message ||
            `Server returned error ${response.status}`
        );

        return;
      }

      if (!data.success) {
        Alert.alert(
          "Registration Failed",
          data.message || "Unable to create account."
        );

        return;
      }

      // Save user
      if (data.user) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Save token if backend returns one
      if (data.token) {
        await AsyncStorage.setItem(
          "token",
          data.token
        );
      }

      // Remove temporary registration data
      await AsyncStorage.removeItem(
        "pendingRegistration"
      );

      Alert.alert(
        "Registration Successful 🎉",
        "Your KARIGAR account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              if (role === "karigar") {
                router.replace("/karigar");
              } else {
                router.replace("/customer");
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "REGISTRATION ERROR:",
        error
      );

      Alert.alert(
        "Connection Error",
        `Unable to connect to the backend.\n\nBackend:\n${API_URL}:5000`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKarigar = async () => {
    /*
      Keep the existing Karigar Details flow.
      Registration API will be completed after
      Karigar Details are submitted.
    */

    router.push("/karigar-details" as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>KARIGAR</Text>

      <Text style={styles.title}>
        Choose Your Role
      </Text>

      <Text style={styles.subtitle}>
        Choose how you want to use KARIGAR
      </Text>

      {/* CUSTOMER */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => registerUser("customer")}
        disabled={loading}
      >
        <Text style={styles.icon}>👤</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Customer
          </Text>

          <Text style={styles.cardText}>
            I want to book a worker
          </Text>
        </View>
      </TouchableOpacity>

      {/* KARIGAR */}
      <TouchableOpacity
        style={styles.card}
        onPress={handleKarigar}
        disabled={loading}
      >
        <Text style={styles.icon}>🛠️</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Karigar
          </Text>

          <Text style={styles.cardText}>
            I want work and booking requests
          </Text>
        </View>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color="#FF6B00"
          />

          <Text style={styles.loadingText}>
            Creating your account...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FF6B00",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 35,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  icon: {
    fontSize: 40,
    marginRight: 18,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 5,
  },

  cardText: {
    fontSize: 14,
    color: "#6B7280",
  },

  loadingBox: {
    alignItems: "center",
    marginTop: 15,
  },

  loadingText: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 14,
  },
});