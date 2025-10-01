import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";


const Chat = () => {
    const {targetUserId}=useParams();
    const [messages,setMessages]=useState([{text:"Hello World"}]);
    const user= useSelector(store=>store.user);
    const userId=user?._id;

    useEffect(()=>{
      const socket= createSocketConnection();
      socket.emit("joinChat",{userId,targetUserId});

    },[])
  return (
    <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col" >
     <h1 className="p-5 border-b border-gray-600">Chat</h1>
     <div className="flex-1 overflow-scroll p-5"> 
        {messages.map((msg,index)=>{
          return (
            <div key={index} className="chat chat-start">
  <div className="chat-header">
    Obi-Wan Kenobi
    <time className="text-xs opacity-50">2 hours ago</time>
  </div>
  <div className="chat-bubble">You were the Chosen One!</div>
  <div className="chat-footer opacity-50">Seen</div>
</div>

          )
        })}
     </div>
     <div className="p-5 border-t border-gray -600 flex items-center gap-2">
        <input className="flex-1 border border-gray-500 rounded"></input>
        <button className="btn btn-secondary">Send</button>
     </div>
    </div>
  )
}

export default Chat
