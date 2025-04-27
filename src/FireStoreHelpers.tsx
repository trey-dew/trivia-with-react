// src/firestoreHelpers.ts
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

// Add a new user (or any data)
export const addUser = async (userData: { name: string; email: string }) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), userData);
    console.log('Document written with ID:', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document:', e);
  }
};

// Fetch all users
export const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const users = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return users;
};

// Fetch a single user
export const fetchUserById = async (id: string) => {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log('No such document!');
    return null;
  }
};

// Update a user
export const updateUser = async (id: string, newData: any) => {
  const docRef = doc(db, 'users', id);
  await setDoc(docRef, newData, { merge: true }); // merge: true keeps existing data
};
