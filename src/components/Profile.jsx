import React from 'react'
import EditProfile from './EditProfile'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {
    const user=useSelector((store)=>store?.user);
  return (
    user && (
    <div>
      <EditProfile user={user}/>
    </div>)
  )
}

export default Profile
