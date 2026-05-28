import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "../screens/Login";
import MovieList from "../screens/MovieList";
import MovieSearch from "../screens/MovieSearch";
import MovieResults from "../screens/MovieResults";
import SignUp from "../screens/SignUp";

const Stack = createNativeStackNavigator();

export default function RootNavigator({
  lists,
  createList,
  addMovieToList,
  removeMovieFromList,
  deleteList,
  isLoggedIn,
  setIsLoggedIn,
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
        <>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>

      <Stack.Screen name="SignUp">
        {(props) => <SignUp {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      </>
        ) : (
          <>
            <Stack.Screen name="MovieList">
              {(props) => (
                <MovieList
                  {...props}
                  lists={lists}
                  createList={createList}
                  deleteList={deleteList}
                  removeMovieFromList={removeMovieFromList}
                  addMovieToList={addMovieToList}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="MovieSearch">
              {(props) => (
                <MovieSearch
                  {...props}
                  lists={lists}
                  addMovieToList={addMovieToList}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="MovieResults">
              {(props) => (
                <MovieResults
                  {...props}
                  lists={lists}
                  addMovieToList={addMovieToList}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
