import { useEffect, useState, useRef } from 'react'
import { getGroup, updateGroup, deleteGroup } from '../providers/firebase'
import { Link, useParams, useNavigate } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsShieldLock } from 'react-icons/bs'
import { makePairs, sleep } from '../utils'

export default function Group (props) {
  var { groupId } = useParams()
  const [group, setGroup] = useState(null)
  const [showModal, toggleModal] = useState(false)
  const [nameRotAngle, setNameRotAngle] = useState(null)
  var wantsRef = useRef(null)
  const navigate = useNavigate()

  const loadGroupData = async () => {
    let g = await getGroup(groupId)
    setGroup(g)
    // Force user to enter wants if none specified yet.
    if (!g.members[g.members.findIndex(m => m.uid === props.user.uid)].hasOwnProperty('wants'))
      toggleModal(true)
  }
  
  useEffect(() => {
    // Self-invoking async hook
    (async () => {
      await loadGroupData()
      await sleep(100)
      setNameRotAngle(Math.floor(Math.random()*5)-2)
    })()
  }, [])

  const submitWants = async (t) => {
    let g = {...group},
        userIdx = g.members.findIndex(m => m.uid === props.user.uid)
    g.members[userIdx].wants = t
    await updateGroup(g)
  }

  const generateMatches = async (g) => {
    let groupCopy = {...g}        // Clone group data
    groupCopy.matches = makePairs(g.members)
    await updateGroup(groupCopy)  // Update DB
    await loadGroupData()         // Reload group data
  }

  return (
    <div className='page group'>
      <div className='heading' style={{ marginBottom: '10px' }}>
        <div className='back'>
          <Link to="/groups">
            <BsFillArrowLeftCircleFill />
            <span>Back to Groups</span>
          </Link>
        </div>
        {group ? (
          <div className='title'>
            {group.isPrivate ? (
              <div style={{ width: '10%', paddingRight: '10px' }}>
                <BsShieldLock />
              </div>
            ) : null}
            <h1>{group.name}</h1>
          </div>
        ) : null}
      </div>

      <div className='content'>
        {group ? (
          <>
            {/* If group matches have been made, show current users recipient. */}
            {'matches' in group ? (
              <>
                {group.matches.some(m => m.santa.uid === props.user.uid || m.recipient.uid === props.user.uid) ? (
                  <>
                    <h2>You are getting a present for:</h2>
                    <div className={`recipient ${nameRotAngle !== null ? 'active' : ''}`} style={{ transform: `rotate(${nameRotAngle}deg)` }}>
                      <span>{group.matches[group.matches.findIndex(p => p.santa.uid === props.user.uid)].recipient.displayName}</span>
                      <span>•</span>
                      <span className='wants-intro'>they would like</span>
                      <span>{group.matches[group.matches.findIndex(p => p.santa.uid === props.user.uid)].recipient.wants}</span>
                    </div>
                  </>
                ) : (
                  <h2>You have joined a group that has already picked matches.</h2>
                )}
              </>
            ) : group.members?.[0].uid !== props.user.uid ? (
              <div className='wait-alert'>
                <span role='img'>⚠️</span>
                <h2>Wait for the group owner to make matches.</h2>
              </div>
            ) : null}
      
            {/* Remind members of access code, if private. */}
            {group.isPrivate ? (
              <h2 style={{ marginBottom: '20px' }}>Access Code:<span style={{ marginLeft: '15px', fontWeight: '300' }}>
                {group.privateCode}</span></h2>
            ) : null}

            {/* If user has entered wants, show. */}
            {group.members[group.members.findIndex(m => m.uid === props.user.uid)].hasOwnProperty('wants') ? (
              <>
                <h2>You asked Santa for:</h2>
                <ul><li className='recipient active sm' style={{ fontFamily: 'Caveat' }}>
                  {group.members[group.members.findIndex(m => m.uid === props.user.uid)].wants}
                </li></ul>
              </>
            ) : null}

            {/* Group creator info */}
            {group.members?.[0].uid === props.user.uid ? (
              <>
                <div className='members' style={{ marginTop: '20px' }}>
                  <h2>Group Members:</h2>
                  <ul>
                    {group.members.map((memberLol, idx) => {
                      return <li className='memberLol recipient active sm' style={{ fontFamily: 'Caveat' }} key={idx}>{memberLol.displayName}</li>
                    })}
                  </ul>
                </div>

                {group.members.length > 1 ? (
                  <button className='btn' style={{ margin: '100px auto 20px' }}
                    onClick={async () => {
                      if (group.hasOwnProperty('matches')) {
                        if (confirm('Matches have already been made. Are you sure you want to repick matches?'))
                          await generateMatches(group)
                      } else await generateMatches(group)
                    }}>
                    Generate Matches</button>
                ) : null}

                <button className='btn' style={{ margin: '50px auto 20px', backgroundColor: 'transparent', color: 'white', boxShadow: 'none', border: '2px solid white' }}
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete '${group.name}' group?`))
                    await deleteGroup(group)
                    navigate('/groups')
                  }}>
                  Delete Group</button>
              </>
            ) : null}
          </>
        ) : (
          <div className='loading'>
            <div className='spinner'></div>
          </div>
        )}
      </div>


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