import { initializeApp } from "firebase/app"
import { getFirestore, doc, addDoc, setDoc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore'
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


// CREATE group
const createGroup = async (group) => {
  return await addDoc(collection(firestore, 'groups'), group)
}

// RETRIEVE groups
const getGroups = async () => {
  const groupsSnap = await getDocs(collection(firestore, 'groups'))
  var groups = []
    groupsSnap.forEach(doc => {
      groups.push({...doc.data(), id: doc.id})
    })
  return groups
}

// RETRIEVE group
const getGroup = async (id) => {
  const groupSnap = await getDoc(doc(firestore, 'groups', id))
  if (groupSnap.exists())
    return {...groupSnap.data(), id: groupSnap.id}
  else return null
}

// UPDATE group
const joinGroup = async (g, uid) => {
  let groupDoc = doc(firestore, 'groups', g.id)
  await updateDoc(groupDoc, {
    members: [...g.members, uid]
  })
}

export { auth, firestore, getGroups, getGroup, createGroup, joinGroup }