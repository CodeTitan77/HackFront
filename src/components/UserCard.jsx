
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { removeUserFromFeed } from '../utils/feedSlice';
/* eslint-disable react/prop-types */
const UserCard=({user})=>{
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch=useDispatch();
  const handleSendRequest=async(status,userId)=>{
    try{
      const res=await axios.post(BASE_URL+"/request/send/"+status+"/"+userId,{}
        ,{withCredentials:true}
      );
     dispatch(removeUserFromFeed(userId));
    }
    catch(error){
      console.log("Error in sending request(interested,rejected from feed)")

    }

  }

  return (
    <div>
        <div className="card bg-base-300 w-96 shadow-xl">
  <figure>
    <img
      src={user?.photoUrl}
      alt="Shoes" />
  </figure>
  <div className="card-body">
<h2 className="card-title">{firstName + " " + lastName}</h2>
    {age && gender && <p>{age+", "+ gender}</p>}
    <p>{about}</p>
    <div className="card-actions justify-center my-4">
      <button className="btn btn-primary" onClick={()=>handleSendRequest("ignored",_id)}>Ignore</button>
       <button className="btn btn-secondary" onClick={()=>handleSendRequest("interested",_id)}>Interested</button>
    </div>
  </div>
</div>
      
    </div>
  )
}

export default UserCard
