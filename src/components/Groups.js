import { useEffect, useState } from 'react'
import { getGroups, joinGroup } from '../providers/firebase'
import { Link, useNavigate } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsPlusCircle, BsLockFill } from 'react-icons/bs'

export default function Groups (props) {
  const navigate = useNavigate()
  const [groups, loadGroups] = useState(null)
  const [modal, toggleModal] = useState(false)
  
  useEffect(() => {
    let getAllGroups = async () => {
      loadGroups(await getGroups() ?? []) }
    getAllGroups()
  }, [])

  const attemptJoinGroup = async (g) => {
    console.log(g);
    if ('isPrivate' in g && g.isPrivate === 'true') {
      // toggleModal(true)
    } else {
      await joinGroup(g, props.user.uid)
      navigate(`/group/${g.id}`)
    }
  }

  return (
    <div className='page groups'>
      <div className='back'>
        <Link to="/">
          <BsFillArrowLeftCircleFill />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className='heading'>
        <h1>Groups</h1>
        <div className='icon'>
          <Link to='/create'>
            <BsPlusCircle />
          </Link>
        </div>
      </div>
      
      {groups ? (
        groups.map((group, idx) => {
          return <div className='group' key={idx}>
                    <span>{group.name}</span>
                    {group.members.some(m => m.uid == props.user.uid) ? (
                      <Link to={`/group/${group.id}`}>
                        <button className='btn'>View</button>
                      </Link>
                    ) : (
                      <button className='btn' onClick={() => { attemptJoinGroup(group) }}>
                        {group.isPrivate ? <BsLockFill size={14} /> : null} Join</button>
                    )}
                  </div>
        })
      ) : (
        <div className='loading'>
          <div className='spinner'></div>
        </div>
      )}
      

      <div className={`modal ${modal ? 'active' : ''}`}>

      </div>
    </div>
  )
}