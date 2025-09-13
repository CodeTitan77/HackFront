import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId,setEmailId]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const[isLoginForm,setisLoginForm]=useState(false);
    const dispatch =useDispatch();
    const navigate=useNavigate();
    const handleLogin= async()=>{
      try{
         const res=  await axios.post(BASE_URL+"/login",{
        emailId,
        password,

      },{
        withCredentials:true
      });
      // console.log(res.data);
      dispatch(addUser(res.data));
      return navigate("/");

      }
      catch(error){
        setError(error?.response?.data);
        console.log(error);

      }
    

    };
    const handleSignUp=async()=>{
      try{
       const res=  await axios.post(BASE_URL+"/signup",{
        firstName,
        lastName,
        emailId,
        password,

      },{
        withCredentials:true
      });
      console.log(res.data);
      dispatch(addUser(res.data.data));
      return navigate("/profile");

      }
      
      catch(error){
        setError(error?.response?.data);
        console.log(error);
      }

    }

  return (
    <div className="flex justify-center my-10">
    <div className="card bg-base-300 w-96 shadow-xl">
  <div className="card-body">
    <h2 className="card-title justify-center">{isLoginForm?"Login":"Sign Up"}</h2>

    {!isLoginForm && <>
   <label className="form-control w-full max-w-xs my-2 ">
  <div className="label">
    <span className="label-text">First Name </span>
    
  </div>
  <input value={firstName} onChange={(e)=>setFirstName(e.target.value)}type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
  
</label>

  <label className="form-control w-full max-w-xs my-2 ">
  <div className="label">
    <span className="label-text">Last Name </span>
    
  </div>
  <input value={lastName} onChange={(e)=>setLastName(e.target.value)}type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
  
</label>
</>}

  <label className="form-control w-full max-w-xs my-2 ">
  <div className="label">
    <span className="label-text">Email Id </span>
    
  </div>
  <input value={emailId} onChange={(e)=>setEmailId(e.target.value)}type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
   
</label>




 <label className="form-control w-full max-w-xs my-2 ">
  <div className="label">
    <span className="label-text">Password </span>
    
  </div>
  <input value={password} onChange={(event)=>setPassword(event.target.value)} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
  
</label>
   {error &&<p className="text-red-500">{error}</p>}
    <div className="card-actions justify-center">
      <button className="btn btn-primary" onClick={isLoginForm?handleLogin:handleSignUp}>{isLoginForm?"Login":"Sign Up"}</button>
    </div>

    <p className="py-2 m-auto cursor-pointer" onClick={()=>setisLoginForm((value)=> !value)}>{isLoginForm ? "New User ? Signup here":"Existing User?Login Here"}</p>
  </div>
</div>
    </div>
  )
}

export default Login
