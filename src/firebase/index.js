/* eslint-disable no-unused-vars */
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyA56nGU7gWkVTyxWYlU5LF0Gp49kNbQf80",
  authDomain: "todo-app-be956.firebaseapp.com",
  projectId: "todo-app-be956",
  storageBucket: "todo-app-be956.appspot.com",
  messagingSenderId: "360146117527",
  appId: "1:360146117527:web:7bdaeea394c78587eb1ad2",
  measurementId: "G-65WG2MSC5Z",
};

export const createUserProfileDoc = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName: name, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        name,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return userRef;
};

export const createTodoDoc = async (userId, payload) => {
  if (!userId) {
    return;
  }

  const todoRef = firestore.doc(`users/${userId}`).collection("todos");
  const newDocRef = todoRef.doc();

  try {
    await newDocRef.set(payload);
  } catch (error) {
    console.log(error.message);
  }
  const snapshot = await newDocRef.get();

  return {
    id: snapshot.id,
    ...snapshot.data(),
    date: snapshot.data().date.seconds * 1000,
  };
};

export const updateTodoDoc = async (userId, todoId, payload) => {
  if (!userId || !todoId) return;

  const todoDocRef = firestore.doc(`users/${userId}/todos/${todoId}`);
  let snapshot = await todoDocRef.get();

  if (!snapshot.exists) return;

  try {
    await todoDocRef.update({ ...snapshot.data(), ...payload });
  } catch (error) {
    console.log(error.message);
  }

  snapshot = await todoDocRef.get();
  return {
    id: snapshot.id,
    ...snapshot.data(),
    date: snapshot.data().date.seconds * 1000,
  };
};

export const removeTodoDoc = async (userId, todoId) => {
  if (!userId || !todoId) return;

  const todoDocRef = firestore.doc(`users/${userId}/todos/${todoId}`);
  let snapshot = await todoDocRef.get();

  if (!snapshot.exists) return;

  try {
    await todoDocRef.delete();
  } catch (error) {
    console.log(error.message);
  }
};

export const removeAllTodoDoc = async (userId) => {
  if (!userId) return;
  const todoRef = firestore.doc(`users/${userId}`).collection("todos");
  const snapshot = await todoRef.get();
  if (snapshot.empty) return;

  const batch = firestore.batch();

  snapshot.docs.map((doc) => {
    batch.delete(doc.ref);
  });

  return await batch.commit();
};

export const transformTodos = (todos) => {
  return todos.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.seconds * 1000,
  }));
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
