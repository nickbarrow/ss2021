import { initializeApp } from "firebase/app"
import { getFirestore, doc, addDoc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore'
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB0FX4zHBFyGVgcDsB6r1IB8-X-KEIS4XI",
  authDomain: "ss2021-ae6c1.firebaseapp.com",
  projectId: "ss2021-ae6c1",
  storageBucket: "ss2021-ae6c1.appspot.com",
  messagingSenderId: "121556293224",
  appId: "1:121556293224:web:a9260a0ed9bcc0dc82cddd",
  measurementId: "G-TF53E3F8B3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


// Get all groups.
const getGroups = async () => {
  const groupsSnap = await getDocs(collection(firestore, 'groups'))
  var groups = []
    groupsSnap.forEach(doc => {
      groups.push({...doc.data(), title: doc.id})
    })
  return groups
}

// Get group data.
const getGroup = async (id) => {
  const groupSnap = await getDoc(doc(firestore, 'groups', id))
  if (groupSnap.exists())
    return {...groupSnap.data(), id: groupSnap.id}
  else return null
}

// Save a map to firestore.
const createGroup = async (group) => {
  return await addDoc(collection(firestore, 'groups'), group)
}

export { auth, firestore, getGroups, getGroup, createGroup }