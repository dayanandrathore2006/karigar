import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

const API_URL = "http://192.168.29.46:5000";

const categories = [
  { name: "Electrician", icon: "⚡" },
  { name: "Plumber", icon: "🔧" },
  { name: "Painter", icon: "🎨" },
  { name: "Carpenter", icon: "🪚" },
  { name: "Mason", icon: "🧱" },
  { name: "Helper", icon: "💪" },
];

export default function CustomerScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const findKarigars = async (selectedSkill?: string) => {
    try {
      setLoading(true);

      let url = `${API_URL}/api/karigars`;

      if (selectedSkill) {
        url += `?skill=${encodeURIComponent(selectedSkill)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (!data.karigars || data.karigars.length === 0) {
          Alert.alert(
            "No Karigar Found",
            selectedSkill
              ? `No available ${selectedSkill} found right now.`
              : "No available karigar found right now."
          );
          return;
        }

        router.push({
          pathname: "/karigar-list",
          params: {
            skill: selectedSkill || "All",
            data: JSON.stringify(data.karigars),
          },
        });
      } else {
        Alert.alert(
          "Error",
          data.message || "Unable to fetch karigars."
        );
      }
    } catch (error) {
      console.error("Find Karigars Error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>KARIGAR</Text>
          <Text style={styles.headerSubtitle}>
            Find trusted workers near you
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* WELCOME CARD */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            What work do you need?
          </Text>

          <Text style={styles.welcomeSubtitle}>
            Choose a service and find an available karigar.
          </Text>
        </View>

        {/* CATEGORY TITLE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          <Text style={styles.sectionCount}>
            {categories.length} Services
          </Text>
        </View>

        {/* CATEGORIES */}
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => findKarigars(category.name)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.categoryIcon}>
                  {category.icon}
                </Text>
              </View>

              <Text style={styles.categoryName}>
                {category.name}
              </Text>

              <Text style={styles.bookText}>
                Find Workers →
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FIND ALL */}
        <TouchableOpacity
          style={styles.findButton}
          activeOpacity={0.85}
          onPress={() => findKarigars()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.findButtonText}>
              FIND ALL KARIGARS
            </Text>
          )}
        </TouchableOpacity>

        {/* MY BOOKINGS */}
        <TouchableOpacity
          style={styles.myBookingsButton}
          activeOpacity={0.8}
          onPress={() => router.push("/my-bookings" as any)}
        >
          <Text style={styles.myBookingsText}>
            MY BOOKINGS
          </Text>
        </TouchableOpacity>

        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🛠️</Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Trusted Local Workers
            </Text>

            <Text style={styles.infoText}>
              Compare available karigars, check their experience
              and hourly rate before booking.
            </Text>
          </View>
        </View>

        {/* HOW IT WORKS */}
        <Text style={styles.howTitle}>How It Works</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Choose a Service
              </Text>

              <Text style={styles.stepText}>
                Select the type of work you need.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Select a Karigar
              </Text>

              <Text style={styles.stepText}>
                View available workers and their details.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Book & Track
              </Text>

              <Text style={styles.stepText}>
                Send a booking request and track its status.
              </Text>
            </View>
          </View>
        </View>

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
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  logo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FF6B00",
    letterSpacing: 2,
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  logoutText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  welcomeCard: {
    backgroundColor: "#FF6B00",
    borderRadius: 18,
    padding: 22,
    marginBottom: 25,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  welcomeSubtitle: {
    color: "#FFF3E8",
    fontSize: 14,
    lineHeight: 21,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#1F2937",
  },

  sectionCount: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  categoryIcon: {
    fontSize: 27,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 7,
  },

  bookText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF6B00",
  },

  findButton: {
    width: "100%",
    height: 54,
    borderRadius: 13,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  findButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  myBookingsButton: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 22,
    backgroundColor: "#FFFFFF",
  },

  myBookingsText: {
    color: "#FF6B00",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoIcon: {
    fontSize: 30,
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },

  howTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 15,
  },

  stepsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  stepNumberText: {
    color: "#FF6B00",
    fontSize: 14,
    fontWeight: "900",
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 3,
  },

  stepText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },

  bottomSpace: {
    height: 30,
  },
});