import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>KARIGAR</Text>

      <Text style={styles.tagline}>
        Har Kaam Ke Liye{"\n"}
        Bharosemand Karigar
      </Text>

      <Text style={styles.description}>
        Electrician, Plumber, Painter, Carpenter aur
        bahut saare skilled workers ko aasani se book karein.
      </Text>

      <Link href="/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FF6B00",
    letterSpacing: 3,
    marginBottom: 20,
  },

  tagline: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 18,
  },

  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },

  button: {
    width: "100%",
    backgroundColor: "#FF6B00",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },
});