import { useEffect, useState } from 'react'
import { getGroups } from '../utils/firebase'
import { Link } from "react-router-dom"
import { BsFillArrowLeftCircleFill } from 'react-icons/bs'

export default function Groups (props) {
  const [groups, loadGroups] = useState(null)
  
  useEffect(() => {
    let getAllGroups = async () => {
      loadGroups(await getGroups())
    }
    getAllGroups()
  }, [])


  return (
    <div className='page groups'>
      <div className='back'>
        <Link to="/">
          <BsFillArrowLeftCircleFill />
          <span>Back to Home</span>
        </Link>
      </div>
      <h1>Groups</h1>
      {groups && groups.map((group, idx) => {
        return <div className='group' key={idx}>
                  <span>{group.title}</span>
                  <button className='btn'>Join</button>
                </div>
      })}
    </div>
  )
}