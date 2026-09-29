import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleContinue = async () => {
    if (!name || !mobile || !password) {
      Alert.alert(
        "Missing Details",
        "Name, mobile aur password bharna zaroori hai."
      );
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert(
        "Invalid Mobile",
        "10 digit mobile number enter karo."
      );
      return;
    }

    try {
      const registrationData = {
        name,
        mobile,
        email,
        password,
      };

      await AsyncStorage.setItem(
        "pendingRegistration",
        JSON.stringify(registrationData)
      );

      router.push("/role");
    } catch (error) {
      console.error("Registration data error:", error);

      Alert.alert(
        "Error",
        "Registration details save nahi ho paayi."
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>KARIGAR</Text>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Register to get started
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          CONTINUE
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.orange}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 40,
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
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  input: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
    color: "#1F2937",
  },

  button: {
    height: 55,
    backgroundColor: "#FF6B00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },

  loginText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
  },

  orange: {
    color: "#FF6B00",
    fontWeight: "700",
  },
});