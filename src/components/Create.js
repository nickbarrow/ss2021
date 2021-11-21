import { useRef, useState } from 'react'
import { createGroup } from '../providers/firebase'
import { Link, useNavigate } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsPlusCircle } from 'react-icons/bs'

export default function Create (props) {
  var nameRef = useRef(null)
  var codeRef = useRef(null)
  const navigate = useNavigate()
  const [isPrivate, togglePrivate] = useState(false)

  const create = async () => {
    if (nameRef.current.value) {
      let p = {}
      if(isPrivate && codeRef.current.value) p = { isPrivate: 'true', privateCode: codeRef.current.value }
      let docRef = await createGroup({
        name: nameRef.current.value,
        members: [JSON.parse(JSON.stringify(props.user))],
        ...p
      })
      navigate(`/group/${docRef.id}`)
    }
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
        <h1>Create</h1>
      </div>

      <div className='input'>
        <label>
          <h3>Group Name:</h3>
          <input id="groupName" ref={nameRef} className='code' />
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ marginRight: '15px' }}>Private?</h3>
          <input type="checkbox"
            onChange={(e) => { togglePrivate(e.target.checked) }}
            style={{ width: '5vw', height: '5vw' }} />
        </div>
        {isPrivate ? (
          <>
            <label for='privateCode'>
              <h3>Secret code:</h3>
            </label>
            <input id='privateCode' ref={codeRef} type="text" maxlength="4" />
          </>
        ) : null}
      </div>

      <button className='btn' onClick={create}>Go</button>
    </div>
  )
}