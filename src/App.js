import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Groups from './components/Groups'
import Create from './components/Create'
import Group from './components/Group'
import Privacy from './components/Privacy'

export default function App () {
  const [user, setUser] = useState(null)
  
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route path="/groups" element={user ? <Groups user={user} /> : <Navigate to='/' />} />
          <Route path="/create" element={user ? <Create user={user} /> : <Navigate to='/' />} />
          <Route path="/group/:groupId" element={user ? <Group user={user} /> : <Navigate to='/' />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/deleteuserdata" element={<Privacy />} />
        </Routes>
      </div>
      <div className='footer'>
        <p>Made with <span role='img'>❤️</span> in the cave</p>
      </div>
    </>
  );
}
