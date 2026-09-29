import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";

type Karigar = {
  _id: string;
  name: string;
  mobile: string;
  skill: string;
  experience: number;
  rate: number;
  rating: number;
  available: boolean;
};

export default function KarigarListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const skill = params.skill
    ? String(params.skill)
    : "All";

  const karigars: Karigar[] = useMemo(() => {
    try {
      if (!params.data) return [];

      return JSON.parse(String(params.data));
    } catch (error) {
      console.error("Karigar Data Error:", error);
      return [];
    }
  }, [params.data]);

  const bookKarigar = (karigar: Karigar) => {
    Alert.alert(
      "Book Karigar",
      `${karigar.name} ko book karna hai?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          onPress: () => {
            router.push({
              pathname: "/booking",
              params: {
                karigarId: karigar._id,
                karigarName: karigar.name,
                skill: karigar.skill,
                rate: String(karigar.rate),
              },
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Available Karigars</Text>

          <Text style={styles.subtitle}>
            {skill === "All"
              ? "All available workers"
              : `${skill} near you`}
          </Text>
        </View>
      </View>

      {/* Loading / Empty / List */}
      {karigars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>

          <Text style={styles.emptyTitle}>
            No Karigar Found
          </Text>

          <Text style={styles.emptyText}>
            Is category ke liye abhi koi available karigar
            nahi mila.
          </Text>

          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeText}>
              GO BACK
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.resultText}>
            {karigars.length} Karigar
            {karigars.length !== 1 ? "s" : ""} Available
          </Text>

          {karigars.map((karigar) => (
            <View
              key={karigar._id}
              style={styles.card}
            >
              {/* Top */}
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {karigar.name
                      ? karigar.name
                          .charAt(0)
                          .toUpperCase()
                      : "K"}
                  </Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.name}>
                    {karigar.name}
                  </Text>

                  <Text style={styles.skill}>
                    {karigar.skill || "Skilled Worker"}
                  </Text>

                  <View style={styles.ratingRow}>
                    <Text style={styles.star}>★</Text>

                    <Text style={styles.rating}>
                      {karigar.rating
                        ? karigar.rating.toFixed(1)
                        : "New"}
                    </Text>

                    <Text style={styles.dot}>•</Text>

                    <Text style={styles.available}>
                      Available
                    </Text>
                  </View>
                </View>
              </View>

              {/* Details */}
              <View style={styles.detailsRow}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailIcon}>
                    🛠️
                  </Text>

                  <View>
                    <Text style={styles.detailLabel}>
                      Experience
                    </Text>

                    <Text style={styles.detailValue}>
                      {karigar.experience || 0} Years
                    </Text>
                  </View>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailIcon}>
                    💰
                  </Text>

                  <View>
                    <Text style={styles.detailLabel}>
                      Starting Rate
                    </Text>

                    <Text style={styles.detailValue}>
                      ₹{karigar.rate || 0}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Book */}
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => bookKarigar(karigar)}
              >
                <Text style={styles.bookButtonText}>
                  BOOK NOW
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  backText: {
    fontSize: 34,
    color: "#1F2937",
    marginTop: -4,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  resultText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
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

  info: {
    flex: 1,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
  },

  skill: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 3,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  star: {
    color: "#F59E0B",
    fontSize: 15,
  },

  rating: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },

  dot: {
    color: "#9CA3AF",
    marginHorizontal: 7,
  },

  available: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },

  detailsRow: {
    flexDirection: "row",
    marginTop: 18,
    marginBottom: 18,
  },

  detailBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  detailIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  detailLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 2,
  },

  bookButton: {
    backgroundColor: "#FF6B00",
    borderRadius: 11,
    paddingVertical: 14,
    alignItems: "center",
  },

  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#1F2937",
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  backHomeButton: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 25,
  },

  backHomeText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});