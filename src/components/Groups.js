import { useEffect, useState, useRef } from 'react'
import { getGroups, joinGroup } from '../providers/firebase'
import { Link, useNavigate } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsLockFill, BsShieldLock } from 'react-icons/bs'

export default function Groups (props) {
  const navigate = useNavigate()
  const [groups, loadGroups] = useState(null)
  const [modal, toggleModal] = useState(false)
  const [joiningGroup, setJoiningGroup] = useState(false)
  var privateGroupCodeInputRef = useRef(null)
  
  useEffect(() => {
    let getAllGroups = async () => {
      loadGroups(await getGroups() ?? []) }
    getAllGroups()
  }, [])

  const joinPublicGroup = async (g) => {
    await joinGroup(g, props.user)
    navigate(`/group/${g.id}`)
  }

  const joinPrivateGroup = async (g, v) => {
    if (v === g.privateCode) {
      await joinGroup(g, props.user)
      navigate(`/group/${g.id}`)
    } else alert('Wrong code!')
  }

  return (
    <div className='page groups'>
      <div className='heading'>
        <div className='back'>
          <Link to="/">
            <BsFillArrowLeftCircleFill />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className='title' style={{ justifyContent: 'space-between' }}>
          <h1>Groups</h1>
          <Link to='/create'>
            <button className='btn' style={{ margin: '0 10px 0 0' }}>Create</button>
          </Link>
        </div>
      </div>
      
      <div className='content'>
        {groups ? (
          <div className='group-list'>
            {groups.map((group, idx) => {
              return <div className='group' key={idx}>
                        <h3>{group.isPrivate ? <BsShieldLock /> : null} {group.name}</h3>
                        {group.members.some(m => m.uid == props.user.uid) ? ( // Already in group
                            <Link to={`/group/${group.id}`}>
                              <button className='btn'>View</button>
                            </Link>
                          ) : group.isPrivate ? ( // Join private group
                            <button className='btn' onClick={() => { toggleModal(true); setJoiningGroup(group) }}>
                              Join</button>
                          ) : <button className='btn' onClick={() => { joinPublicGroup(group) }}>Join</button>  // Public group
                        }
                      </div>
            })}
          </div>
        ) : (
          <div className='loading'>
            <div className='spinner'></div>
          </div>
        )}
      </div>

      <div className={`modal ${modal ? 'active' : ''}`}>
        <div className='body'>
          <h3>Enter secret code:</h3>
          <input ref={privateGroupCodeInputRef} />
          <div className='btn-footer'>
            <button onClick={() => { toggleModal(false); setJoiningGroup(null) }}>Cancel</button>
            <button onClick={() => { joinPrivateGroup(joiningGroup, privateGroupCodeInputRef.current.value) }}>OK</button>
          </div>
        </div>
      </div>
    </div>
  )
}