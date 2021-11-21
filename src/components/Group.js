import { useEffect, useState, useRef } from 'react'
import { getGroup, updateGroup } from '../providers/firebase'
import { Link, useParams } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsShieldLock } from 'react-icons/bs'

export default function Group (props) {
  var { groupId } = useParams()
  const [group, setGroup] = useState(null)
  const [showModal, toggleModal] = useState(false)
  var wantsRef = useRef(null)
  
  useEffect(() => {
    (async () => {
      let g = await getGroup(groupId),
          userIdx = g.members.findIndex(m => m.uid === props.user.uid)

      if (userIdx >= 0 && !g.members[userIdx].hasOwnProperty('wants'))
        toggleModal(true)
          
      setGroup(g)      
    })()
  }, [])

  const submitWants = async (t) => {
    let g = {...group},
        userIdx = g.members.findIndex(m => m.uid === props.user.uid)
    g.members[userIdx].wants = t
    await updateGroup(g)
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

          <h3 style={{ fontWeight: '300' }}>You asked Santa for:</h3>
          {/* 
          <textarea></textarea>
          <button className='btn' onClick={() => { submitWants(wantsRef.current.value) }}>Submit</button> */}

          {group.members?.[0].uid === props.user.uid ? (
            <>
              <div className='members' style={{ marginTop: '20px' }}>
                Group Members:
                <ul>
                  {group.members.map((memberLol, idx) => {
                    return <li className='memberLol' key={idx}>{memberLol.displayName}</li>
                  })}
                </ul>
              </div>

              {/* <button className="btn">Draw Matches</button> */}
            </>
          ) : null}
        </>
      ) : (
        <div className='loading'>
          <div className='spinner'></div>
        </div>
      )}
      <div className={`modal ${showModal ? 'active' : ''}`}>
        <div className='body'>
          <h3>Add some items you'd like to receive:</h3>
          <textarea ref={wantsRef}></textarea>
          <div className='btn-footer'>
            <button onClick={() => { toggleModal(false) }}>Cancel</button>
            <button onClick={async () => { await submitWants(wantsRef.current.value); toggleModal(false) }}>OK</button>
          </div>
        </div>
      </div>
    </div>
  )
}