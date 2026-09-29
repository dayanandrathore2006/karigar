import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://https://karigar-4fu2.onrender.com29.46:5000";

export default function LoginScreen() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert(
        "Missing Details",
        "Please enter your mobile number and password."
      );
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert(
        "Invalid Mobile",
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    setLoading(true);

    try {
      console.log("Login API:", `${API_URL}/api/auth/login`);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          password,
        }),
      });

      console.log("Login Status:", response.status);

      const responseText = await response.text();

      console.log("Login Response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned an invalid response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        Alert.alert(
          "Login Failed",
          data.message || `Server error (${response.status})`
        );
        return;
      }

      if (data.success) {
        if (data.user) {
          await AsyncStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }

        if (data.token) {
          await AsyncStorage.setItem("token", data.token);
        }

        Alert.alert(
          "Login Successful 🎉",
          `Welcome ${data.user?.name || "User"}`,
          [
            {
              text: "Continue",
              onPress: () => {
                if (data.user?.role === "karigar") {
                  router.replace("/karigar");
                } else {
                  router.replace("/customer");
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid login details."
        );
      }
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      Alert.alert(
        "Connection Error",
        `Unable to connect to the backend.\n\nMake sure the backend is running on:\n${API_URL}:5000`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>KARIGAR</Text>

        <Text style={styles.title}>Welcome Back 👋</Text>

        <Text style={styles.subtitle}>
          Login to continue to KARIGAR
        </Text>

        <Text style={styles.label}>Mobile Number</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={(text) =>
            setMobile(text.replace(/\D/g, ""))
          }
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() =>
            Alert.alert(
              "Forgot Password",
              "Password recovery will be available soon."
            )
          }
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.loginButton,
            loading && styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>
              LOGIN
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerNormal}>
            Don't have an account?{" "}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/register")}
          >
            <Text style={styles.registerLink}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FF6B00",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 35,
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
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 17,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: -5,
    marginBottom: 20,
  },

  forgotText: {
    color: "#FF6B00",
    fontSize: 14,
    fontWeight: "600",
  },

  loginButton: {
    height: 55,
    backgroundColor: "#FF6B00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  registerNormal: {
    color: "#6B7280",
    fontSize: 15,
  },

  registerLink: {
    color: "#FF6B00",
    fontSize: 15,
    fontWeight: "800",
  },
});