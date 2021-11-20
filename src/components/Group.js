import { useEffect, useState } from 'react'
import { getGroup } from '../providers/firebase'
import { Link, useParams } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsShieldLock } from 'react-icons/bs'

export default function Group (props) {
  var { groupId } = useParams()
  const [group, loadGroup] = useState(null)
  
  useEffect(() => {
    (async () => {
      loadGroup(await getGroup(groupId)) })()
  }, [])

  const submitWants = (t) => {
    let g = {...group},
        tmpUD = g.members.find(m => m.uid === props.user.uid)
        tmpUD.wants = t
  }

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

          <h3 style={{ fontWeight: '300' }}>To enter the drawing, add some items you'd like to receive:</h3>
          <textarea></textarea>
          <button className='btn' onClick={() => { submitWants(wantsRef.current.value) }}>Submit</button>

          {group.members?.[0].uid === props.user.uid ? (
            <>
              <div className='members' style={{ marginTop: '20px' }}>
                Group Members:
                <ul>
                  {group.members.map((memberLol, idx) => {
                    return <div className='memberLol' key={idx}>{JSON.stringify(memberLol, null, 2)}</div>
                  })}
                </ul>
              </div>

              <button className="btn">Draw Matches</button>
            </>
          ) : null}
        </>
      ) : (
        <div className='loading'>
          <div className='spinner'></div>
        </div>
      )}
    </div>
  )
}