import { db } from '../../config/firebase.config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { SET_USER, LOGOUT, SET_LISTS } from '../actionTypes';

const usersCollection = collection(db, 'users');
const listsCollection = collection(db, 'lists');

export const signUp = (name, email, password) => async (dispatch) => {
  const q = query(usersCollection, where('email', '==', email));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    throw new Error('An account with this email already exists.');
  }
  const docRef = await addDoc(usersCollection, { name, email, password });
  dispatch({ type: SET_USER, payload: { docID: docRef.id, name, email } });
};

export const login = (email, password) => async (dispatch) => {
  const q = query(
    usersCollection,
    where('email', '==', email),
    where('password', '==', password)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error('Invalid email or password.');
  }
  const userDoc = snapshot.docs[0];
  const { password: _pw, ...userData } = userDoc.data();
  dispatch({ type: SET_USER, payload: { docID: userDoc.id, ...userData } });
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const subscribeToLists = (userId) => (dispatch) => {
  const q = query(listsCollection, where('userId', '==', userId));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const lists = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    dispatch({ type: SET_LISTS, payload: lists });
  });
  return unsubscribe;
};

export const createList = (userId, name) => async () => {
  await addDoc(listsCollection, { userId, name, movies: [] });
};

export const deleteList = (listId) => async () => {
  await deleteDoc(doc(db, 'lists', listId));
};

export const addMovieToList = (listId, movie, currentMovies) => async () => {
  const exists = currentMovies.some((m) => m.imdbId === movie.imdbId);
  if (exists) return;
  const listRef = doc(db, 'lists', listId);
  await updateDoc(listRef, { movies: [...currentMovies, movie] });
};

export const removeMovieFromList = (listId, imdbId, currentMovies) => async () => {
  const updatedMovies = currentMovies.filter((m) => m.imdbId !== imdbId);
  const listRef = doc(db, 'lists', listId);
  await updateDoc(listRef, { movies: updatedMovies });
};
