import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootNavigator from '../navigation/RootNavigator';
import {
  logout,
  subscribeToLists,
  createList,
  deleteList,
  addMovieToList,
  removeMovieFromList,
} from '../redux/actions/actions';

export default function MovieManager() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const lists = useSelector((state) => state.lists.lists);
  const isLoggedIn = currentUser !== null;

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = dispatch(subscribeToLists(currentUser.docID));
      return () => unsubscribe && unsubscribe();
    }
  }, [currentUser]);

  const handleCreateList = (name) => dispatch(createList(currentUser.docID, name));

  const handleDeleteList = (listId) => dispatch(deleteList(listId));

  const handleAddMovieToList = (listId, movie) => {
    const list = lists.find((l) => l.id === listId);
    if (list) dispatch(addMovieToList(listId, movie, list.movies));
  };

  const handleRemoveMovieFromList = (listId, imdbId) => {
    const list = lists.find((l) => l.id === listId);
    if (list) dispatch(removeMovieFromList(listId, imdbId, list.movies));
  };

  const handleLogout = () => dispatch(logout());

  return (
    <RootNavigator
      lists={lists}
      createList={handleCreateList}
      addMovieToList={handleAddMovieToList}
      deleteList={handleDeleteList}
      removeMovieFromList={handleRemoveMovieFromList}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={(val) => { if (!val) handleLogout(); }}
    />
  );
}
