import { useEffect, useState } from 'react'
import { getGroups } from '../utils/firebase'
import { Link } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsPlusCircle } from 'react-icons/bs'

export default function Groups (props) {
  const [groups, loadGroups] = useState(null)
  
  useEffect(() => {
    let getAllGroups = async () => {
      loadGroups(await getGroups())
    }
    getAllGroups()
  }, [])

  const joinGroup = (g) => {
    if ('private' in g && g.private) {
      
    } else {

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
                    {group.members.includes(props.user.uid) ? (
                      <Link to={`/group/${group.id}`}>
                        <button className='btn'>View</button>
                      </Link>
                    ) : (
                      <button className='btn' onClick={() => { joinGroup(group) }}>Join</button>
                    )}
                  </div>
        })
      ) : (
        <div className='loading'>
          <div className='spinner'></div>
        </div>
      )}
      
    </div>
  )
}