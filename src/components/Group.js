import { useEffect, useState } from 'react'
import { getGroup } from '../utils/firebase'
import { Link, useParams } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsShieldLock } from 'react-icons/bs'

export default function Group (props) {
  var { groupId } = useParams()
  const [group, loadGroup] = useState(null)
  
  useEffect(() => {
    let getGroupData = async () => {
      loadGroup(await getGroup(groupId))
    }
    getGroupData()
  }, [])

  return (
    <div className='page groups'>
      <div className='back'>
        <Link to="/groups">
          <BsFillArrowLeftCircleFill />
          <span>Back to Groups</span>
        </Link>
      </div>

      {group ? (
        <>
          <div className='heading'>
            <h1>{group.isPrivate ? <BsShieldLock /> : null}{group.name}</h1>
          </div>
    
          {group.isPrivate ? (
            <h2 style={{ fontSize: '6vw', fontWeight: '500' }}>Access Code:{group.privateCode}</h2>
          ) : null}

          <div className='members' style={{ marginTop: '20px' }}>
            Group Members:
            {group.members ? (
              <ul>
                {group.members.map((memberLol, idx) => {
                  return <div className='memberLol' key={idx}>{JSON.stringify(memberLol, null, 2)}</div>
                })}
              </ul>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}