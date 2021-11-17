import { useEffect, useState } from 'react'
import { getGroup } from '../utils/firebase'
import { Link, useParams } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsPlusCircle } from 'react-icons/bs'

export default function Group (props) {
  var { groupId } = useParams()
  const [group, loadGroup] = useState(null)
  
  useEffect(() => {
    let getGroupData = async () => {
      loadGroup(await getGroup(groupId))
    }
    getGroupData()
  }, [])

  const joinGroup = () => {
    
  }

  return (
    <div className='page groups'>
      <div className='back'>
        <Link to="/groups">
          <BsFillArrowLeftCircleFill />
          <span>Back to Groups</span>
        </Link>
      </div>

      <div className='heading'>
        <h1>{group?.name}</h1>
      </div>
    </div>
  )
}