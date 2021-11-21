import { useEffect, useState, useRef } from 'react'
import { getGroup, updateGroup, deleteGroup } from '../providers/firebase'
import { Link, useParams } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsShieldLock } from 'react-icons/bs'

export default function Group (props) {
  var { groupId } = useParams()
  const [group, setGroup] = useState(null)
  const [ugd, setUgd] = useState(null)  // User group data - data for this group
  const [showModal, toggleModal] = useState(false)
  var wantsRef = useRef(null)
  
  useEffect(() => {
    // Self-invoking async hook
    (async () => {
      let g = await getGroup(groupId),                          // Get group data
          uig = g.members.find(m => m.uid === props.user.uid)   // Get user's data for this group
          
      setGroup(g)
      setUgd(uig)
          // userIdx = g.members.findIndex(m => m.uid === props.user.uid);

      // // Get user data for current group
      // uig = g[userIdx]

      // Force user to enter wants if none specified yet.
      if (!uig.hasOwnProperty('wants'))
        toggleModal(true)
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
    
          {/* Remind members of access code, if private. */}
          {group.isPrivate ? (
            <h2>Access Code:<span style={{ marginLeft: '15px', fontWeight: '300' }}>{group.privateCode}</span></h2>
          ) : null}

          
          {ugd && 'wants' in ugd ? (
            <>
              <h2>You asked Santa for:</h2>
              <ul><li>{ugd.wants}</li></ul>
            </>
          ) : null}

          {/* Group creator info */}
          {group.members?.[0].uid === props.user.uid ? (
            <>
              <div className='members' style={{ marginTop: '20px' }}>
                <h2>Group Members:</h2>
                <ul>
                  {group.members.map((memberLol, idx) => {
                    console.log(props.user)
                    return <li className='memberLol' key={idx}>{memberLol.displayName}</li>
                  })}
                </ul>
              </div>

              <button className='btn' style={{ marginTop: '100px' }}
                onClick={async () => { await deleteGroup(group) }}>
                Delete Group</button>
            </>
          ) : (
            // Regular group member info
            <h2>That's it! You will be notified when your giftee is chosen!</h2>
          )}
        </>
      ) : (
        <div className='loading'>
          <div className='spinner'></div>
        </div>
      )}

      {/* Wants modal */}
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