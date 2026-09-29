import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://192.168.29.46:5000";

const SKILLS = [
  "Electrician",
  "Plumber",
  "Painter",
  "Carpenter",
  "Mason",
  "Helper",
  "Loading/Unloading",
];

export default function KarigarDetailsScreen() {
  const router = useRouter();

  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!skill) {
      Alert.alert("Missing Skill", "Please select your skill.");
      return;
    }

    if (!experience) {
      Alert.alert("Missing Experience", "Please enter your experience.");
      return;
    }

    if (!rate) {
      Alert.alert("Missing Rate", "Please enter your service rate.");
      return;
    }

    setLoading(true);

    try {
      const pendingData = await AsyncStorage.getItem(
        "pendingRegistration"
      );

      if (!pendingData) {
        Alert.alert(
          "Registration Error",
          "Registration details were not found. Please register again."
        );
        setLoading(false);
        return;
      }

      const registrationData = JSON.parse(pendingData);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...registrationData,
            role: "karigar",
            skill: skill,
            experience: Number(experience),
            rate: Number(rate),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.removeItem("pendingRegistration");

        Alert.alert(
          "Registration Successful",
          "Your Karigar account has been created successfully.",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/karigar"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Registration Failed",
          data.message || "Unable to complete registration."
        );
      }
    } catch (error) {
      console.error("Karigar Registration Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.logo}>KARIGAR</Text>

        <Text style={styles.title}>Karigar Details</Text>

        <Text style={styles.subtitle}>
          Tell us about your professional skills
        </Text>

        {/* SKILL */}
        <Text style={styles.label}>Select Your Skill</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={skill}
            onValueChange={(value) => setSkill(value)}
            style={styles.picker}
          >
            <Picker.Item
              label="Select a skill"
              value=""
            />

            {SKILLS.map((item) => (
              <Picker.Item
                key={item}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>

        {/* EXPERIENCE */}
        <Text style={styles.label}>Experience (Years)</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter experience in years"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={experience}
          onChangeText={setExperience}
          maxLength={2}
        />

        {/* RATE */}
        <Text style={styles.label}>Service Rate</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your rate"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
        />

        <Text style={styles.rateHint}>
          Example: ₹500 per service
        </Text>

        {/* REGISTER BUTTON */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? "CREATING ACCOUNT..." : "CREATE KARIGAR ACCOUNT"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          You can update your professional details later.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F5F7FA",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  logo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FF6B00",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 35,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginTop: 10,
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },

  picker: {
    height: 55,
    width: "100%",
    color: "#1F2937",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
    color: "#111827",
    marginBottom: 5,
  },

  rateHint: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 25,
    marginTop: 3,
  },

  registerButton: {
    backgroundColor: "#FF6B00",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  bottomText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 20,
  },
});