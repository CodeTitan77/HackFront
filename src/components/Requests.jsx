import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { addRequests, removeRequest } from '../utils/requestSlice';
import { useDispatch, useSelector } from 'react-redux';

const Requests = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();
    
    const reviewRequest = async (status, _id) => {
      try {
        const res = axios.post(
          BASE_URL + "/request/review" + "/" + status + "/" + _id, {}, { withCredentials: true }
        );
        dispatch(removeRequest(_id));
      }
      catch (error) {
        console.log(error.message);
      }
    }
    
    const fetchRequests = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/requests/received",
          {
            withCredentials: true,
          });
        dispatch(addRequests(res.data.data));
      }
      catch (error) {
        console.log(error);
      }
    };
    
    useEffect(() => {
      fetchRequests();
    }, [])
    
    if (!requests) return;
    
    if (requests.length === 0) return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-500">
          No Requests Found
        </h1>
      </div>
    )
    
    return (
      <div className="min-h-screen py-8 px-2 sm:px-6 md:px-8 bg-gray-100 flex justify-center overflow-y-auto">
        <div className="w-full max-w-md sm:max-w-3xl space-y-6 pb-32 sm:pb-28 md:pb-24">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Connection Requests
          </h1>
          
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;
            
            return (
              <div
                key={_id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-shadow duration-300 hover:shadow-xl w-full"
              >
                {/* Profile Image */}
                <div className="flex-shrink-0 mb-3 sm:mb-0">
                  <img
                    alt={`${firstName} ${lastName}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-indigo-400"
                    src={photoUrl}
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-grow text-center sm:text-left w-full">
                  <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-1 truncate">
                    {firstName} {lastName}
                  </h2>
                  
                  {/* Age & Gender Badges */}
                  {age && gender && (
                    <div className="flex justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
                        {age} yrs
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                        {gender}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                    {about || "No description available."}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto w-full sm:w-auto">
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto px-4 sm:px-5 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-200" 
                      onClick={() => reviewRequest("rejected", request._id)}
                    >
                      Reject
                    </button>
                    <button 
                      className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto px-4 sm:px-5 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-200" 
                      onClick={() => reviewRequest("accepted", request._id)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default Requests