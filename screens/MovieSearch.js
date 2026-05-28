import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";

export default function MovieSearch({ navigation, setIsLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) {
      return Alert.alert(
        "Search Cannot Be Done!",
        "Please enter a movie name!"
      );
    }

    navigation.navigate("MovieResults", { searchQuery: query });
  };

  const getRandomWord = async () => {
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v2/randomword",
        {
          method: "GET",
          headers: {
            "X-Api-Key": "o1kMc6S2FxH2L1tJfM70Psph30fnnhwZttfEGb9A",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network request failed");
      }

      const data = await response.json();

      if (!data || !Array.isArray(data) || !data[0]) {
        throw new Error("Invalid response from server!");
      }

      return data[0];
    } catch (err) {
      Alert.alert("Error", "Failed to fetch random word. Please try again!");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = async () => {
    setLoading(true);

    try {
      const randomWord = await getRandomWord();

      if (!randomWord) return;

      navigation.navigate("MovieResults", { searchQuery: randomWord });
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../images/wtwbanner.png")}
        style={styles.banner}
        resizeMode="contain"
      />

      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor={theme.colors.white}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.searchButton, styles.randomButton]}
          onPress={handleRandom}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? "Loading..." : "Random"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("MovieList")}
        >
          <Text style={styles.navButtonText}>My Lists</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.logoutButton]}
          onPress={() => setIsLoggedIn(false)}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkBlueBg,
    padding: 20,
  },
  banner: {
    width: "100%",
    height: 100,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  searchInput: {
    backgroundColor: theme.colors.darkBlueBg,
    borderColor: theme.colors.orange,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.white,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: theme.colors.orange,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  searchButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  randomButton: {
    backgroundColor: "transparent",
    borderColor: theme.colors.orange,
    borderWidth: 1,
  },
  navButtons: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    marginTop: "auto",
  },
  navButton: {
    flex: 1,
    backgroundColor: theme.colors.orange,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  navButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: theme.colors.errorRed,
  },
  logoutButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});
