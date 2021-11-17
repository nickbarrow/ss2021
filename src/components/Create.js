import { useRef } from 'react'
import { createGroup } from '../utils/firebase'
import { Link, useNavigate } from "react-router-dom"
import { BsFillArrowLeftCircleFill, BsPlusCircle } from 'react-icons/bs'

export default function Create (props) {
  var nameRef = useRef(null)
  const navigate = useNavigate()

  const create = async () => {
    if (nameRef.current.value) {
      let docRef = await createGroup({
        name: nameRef.current.value,
        members: [props.user.uid]
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
        <label>Group Name:</label>
        <input ref={nameRef} />
      </div>

      <button className='btn' onClick={create}>Go</button>
    </div>
  )
}