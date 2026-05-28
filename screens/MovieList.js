import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";

export default function MovieList({
  navigation,
  lists,
  removeMovieFromList,
  createList,
  deleteList,
  setIsLoggedIn,
}) {
  const [listVisible, setListVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [posterError, setPosterError] = useState(false);
  const [posterLoading, setPosterLoading] = useState(true);

  const handleCreateList = async () => {
    const name = newListName.trim();

    if (!name) return Alert.alert("Error!", "Don't forget to name your list!");
    if (name.length < 2)
      return Alert.alert("Error!", "List name is too short!");

    try {
      await createList(name);
      setNewListName("");
      setListVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to create list. Please try again!");
    }
  };

  const handleDeleteList = (id) => {
    Alert.alert("Delete List", "Delete this list?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteList(id);
            setSelectedList(null);
          } catch (error) {
            Alert.alert("Error", "Failed to delete list!");
          }
        },
      },
    ]);
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => setSelectedList(item)}
    >
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={styles.movieCount}>
          {item.movies.length} {item.movies.length === 1 ? "movie" : "movies"}
        </Text>
      </View>
      <View style={styles.listActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => setSelectedList(item)}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteList(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderMovieInList = ({ item }) => (
    <View style={styles.movieCard}>
      {item.poster && !posterError ? (
        <View style={styles.posterContainer}>
          {posterLoading && (
            <View style={[styles.moviePoster, styles.posterSkeleton]} />
          )}
          <Image
            source={{
              uri: item.poster,
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
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year ?? "Unknown Year"}</Text>
        {item.imdbUrl && (
          <TouchableOpacity
            style={styles.imdbButton}
            onPress={() => Linking.openURL(item.imdbUrl)}
          >
            <Text style={styles.imdbButtonText}>View on IMDb</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={async () => {
          if (!selectedList) return;
          try {
            await removeMovieFromList(
              selectedList.id,
              item.imdbId
            );
          } catch (error) {
            Alert.alert("Error", "Failed to remove movie!");
          }
        }}
      >
        <Text style={styles.removeMovieText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const currentList = selectedList
    ? lists.find((l) => l.id === selectedList.id)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../images/wtwbanner.png")}
        style={styles.banner}
      />

      {currentList ? (
        <>
          <View style={styles.detailHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedList(null)}
            >
              <Text style={styles.backButtonText}>← Lists</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>{currentList.name}</Text>
            <View style={{ width: 60 }} />
          </View>

          <FlatList
            data={currentList.movies}
            renderItem={renderMovieInList}
            keyExtractor={(item) => item.imdbId}
            contentContainerStyle={styles.detailListContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Add movies to get started</Text>
                <TouchableOpacity
                  style={styles.addMoviesButton}
                  onPress={() => navigation.navigate("MovieSearch")}
                >
                  <Text style={styles.addMoviesButtonText}>
                    Search & Add Movies
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Movie Lists</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setListVisible(true)}
            >
              <Text style={styles.createButtonText}>Create List</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={lists}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You don't have any lists yet.
                </Text>
                <TouchableOpacity
                  style={styles.addMoviesButton}
                  onPress={() => setListVisible(true)}
                >
                  <Text style={styles.addMoviesButtonText}>
                    Create Your First List
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={listVisible}
        onRequestClose={() => setListVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New List</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name your list"
              placeholderTextColor={theme.colors.darkGray}
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setListVisible(false);
                  setNewListName("");
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={handleCreateList}
              >
                <Text style={styles.modalCreateButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.navButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("MovieSearch")}
        >
          <Text style={styles.navButtonText}>Search Movies</Text>
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
  container: { flex: 1, backgroundColor: theme.colors.darkBlueBg, padding: 20 },
  banner: {
    width: "92%",
    height: 100,
    marginLeft: "15",
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.darkBlueBg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.orange },
  createButton: {
    backgroundColor: theme.colors.orange,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
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
  logoutButton: { backgroundColor: theme.colors.errorRed },
  logoutButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.darkBlue,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.md,
  },
  listInfo: { flex: 1 },
  listName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
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
  movieCount: { fontSize: 14, color: theme.colors.lightGray },
  listActions: { flexDirection: "row", gap: theme.spacing.sm },
  viewButton: {
    backgroundColor: theme.colors.orange,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  actionButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: theme.colors.errorRed,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  deleteButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  detailHeader: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.darkBlue,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.orange,
    fontSize: 12,
    fontWeight: "bold",
  },
  detailTitle: { fontSize: 18, fontWeight: "bold", color: theme.colors.orange },
  detailListContent: {
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
  movieInListContent: { flex: 1 },
  movieInListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  movieInListYear: {
    fontSize: 12,
    color: theme.colors.lightGray,
    marginTop: 4,
  },
  imdbButton: {
    height: 32,
    marginTop: theme.spacing.md,
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
  removeMovieText: {
    color: theme.colors.errorRed,
    fontWeight: "bold",
    fontSize: 12,
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
    marginBottom: theme.spacing.md,
  },
  addMoviesButton: {
    backgroundColor: theme.colors.orange,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  addMoviesButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.darkBlue,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.orange,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: theme.colors.darkBlueBg,
    borderColor: theme.colors.orange,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
    fontSize: 16,
  },
  modalButtons: { flexDirection: "row", gap: theme.spacing.md },
  modalCancelButton: {
    flex: 1,
    backgroundColor: theme.colors.darkGray,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  modalCreateButton: {
    flex: 1,
    backgroundColor: theme.colors.orange,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  modalCreateButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});
