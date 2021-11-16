import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Groups from './components/Groups'

export default function App (props) {
  const [user, setUser] = useState(null)
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/groups" element={<Groups />} />
        {/* <Route path="signin" element={<SignIn />} /> */}
      </Routes>
    </div>
  );
}
