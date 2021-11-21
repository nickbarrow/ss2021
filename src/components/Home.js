import { useEffect } from 'react'
import { auth } from '../providers/firebase'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { Link } from "react-router-dom"

export default function Home (props) {
  const provider = new GoogleAuthProvider()

  // Define onAuthStateChanged on mount.
  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => {
      if (newUser) props.setUser(newUser)
      else props.setUser(null)
    })
  })

  return (
    <div className='page home'>
      {!props.user ? (
        <>
          <h1 style={{ fontSize: '11vw' }}>Secret Santa</h1>
          <h2>2021</h2>
          <button className='btn'
            onClick={() => { signInWithPopup(auth, provider) }}>
            Login with Google</button>
        </>
        ) : (
          <>
            <h1 style={{ fontSize: '11vw', marginBottom: '100px' }}>Welcome, Santa</h1>

            <Link to="/groups">
              <button className='btn'>Find a Group</button>
            </Link>
            
            <button className='btn trans'
              onClick={() => { signOut(auth) }}>
              Log Out</button>
          </>
      )}
    </div>
  )
}