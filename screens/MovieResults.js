import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";
import useMoviesAPI from "../components/MoviesAPI";

function MovieCard({ item, onAddPress }) {
  const [posterError, setPosterError] = useState(false);
  const [posterLoading, setPosterLoading] = useState(true);

  return (
    <View style={styles.movieCard}>
      {item["#IMG_POSTER"] && !posterError ? (
        <View style={styles.posterContainer}>
          {posterLoading && (
            <View style={[styles.moviePoster, styles.posterSkeleton]} />
          )}
          <Image
            source={{
              uri: item["#IMG_POSTER"],
              headers: { Referer: "https://www.imdb.com/" },
            }}
            style={[styles.moviePoster, posterLoading && styles.hidden]}
            resizeMode="cover"
            onLoad={() => setPosterLoading(false)}
            onError={() => {
              setPosterError(true);
              setPosterLoading(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.noPoster}>
          <Text style={styles.noPosterText}>No Image</Text>
        </View>
      )}

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item["#TITLE"]}</Text>
        <Text style={styles.movieYear}>{item["#YEAR"] ?? "Unknown Year"}</Text>
        {item["#IMDB_URL"] && (
          <TouchableOpacity
            style={styles.imdbButton}
            onPress={() => Linking.openURL(item["#IMDB_URL"])}
          >
            <Text style={styles.imdbButtonText}>View on IMDb</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onAddPress(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MovieResults({
  navigation,
  route,
  lists,
  addMovieToList,
}) {
  const { searchQuery } = route.params;
  const { loading, data, error, searchMovies } = useMoviesAPI();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleAddPress = (item) => {
    if (!lists || !lists.length) {
      return Alert.alert("No Lists", "Create a list first!");
    }

    if (!item || !item["#TITLE"]) {
      return Alert.alert("Invalid Data", "Movie data is invalid!");
    }

    const movieData = {
      imdbId: item["#IMDB_ID"] ?? "",
      title: item["#TITLE"] ?? "Unknown Title",
      year: item["#YEAR"] ?? "Unknown Year",
      poster: item["#IMG_POSTER"] ?? "",
      imdbUrl: item["#IMDB_URL"] ?? "",
    };

    setSelectedMovie(movieData);
    setModalVisible(true);
  };

  const handleAddToList = async (listItem) => {
    if (!selectedMovie || !listItem?.id) {
      return Alert.alert("Error", "Invalid selection.");
    }

    try {
      await addMovieToList(listItem.id, selectedMovie);
      setModalVisible(false);
      Alert.alert("Added", `Added to "${listItem.name}"`);
    } catch (e) {
      Alert.alert(
        "Error",
        "Failed to add movie. Please check your connection and try again."
      );
    }
  };

  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) {
      setLocalError("Please enter a valid search query!");
      return;
    }

    setLocalError("");
    searchMovies(searchQuery).catch(() => {
      setLocalError("Network error. Please try again!");
    });
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results for "{searchQuery}"</Text>
      </View>

      {(error || localError) && (
        <Text style={styles.errorText}>
          {localError || "Something went wrong. Please try again!"}
        </Text>
      )}

      <FlatList
        data={Array.isArray(data) ? data : []}
        renderItem={({ item }) => (
          <MovieCard item={item} onAddPress={handleAddPress} />
        )}
        keyExtractor={(item, index) =>
          item["#IMDB_ID"] ?? item["#TITLE"] ?? index.toString()
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          loading && (
            <ActivityIndicator
              size="large"
              color={theme.colors.orange}
              style={styles.loader}
            />
          )
        }
        ListEmptyComponent={
          !loading &&
          !error &&
          !localError && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          )
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to List</Text>

            <FlatList
              data={lists}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleAddToList(item)}
                >
                  <Text style={styles.listItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.errorText}>
                  No lists available. Create one first.
                </Text>
              }
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.darkBlueBg, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.orange,
    borderRadius: theme.borderRadius.md,
  },
  backButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  headerTitle: {
    flex: 1,
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  loader: { marginTop: theme.spacing.xl },
  errorText: {
    color: theme.colors.errorRed,
    textAlign: "center",
    marginTop: theme.spacing.md,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  movieCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.darkBlue,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.md,
  },
  posterContainer: { width: 60, height: 90 },
  moviePoster: { width: 60, height: 90, borderRadius: theme.borderRadius.sm },
  posterSkeleton: {
    position: "absolute",
    backgroundColor: theme.colors.darkBlueBg,
    opacity: 0.6,
  },
  hidden: { opacity: 0 },
  noPoster: {
    width: 60,
    height: 90,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.darkBlueBg,
    justifyContent: "center",
    alignItems: "center",
  },
  noPosterText: {
    color: theme.colors.darkGray,
    fontSize: 10,
    textAlign: "center",
  },
  movieInfo: { flex: 1 },
  movieTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  movieYear: { fontSize: 13, color: theme.colors.lightGray, marginBottom: 2 },
  imdbButton: {
    height: 32,
    marginTop: theme.spacing.xs,
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.orange,
    borderRadius: theme.borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  imdbButtonText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "bold",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.lightGray,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: theme.colors.darkBlue,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  listItem: {
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkBlueBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkBlueBg,
  },
  listItemText: {
    color: theme.colors.white,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  cancelText: {
    color: theme.colors.orange,
    fontWeight: "bold",
  },
});