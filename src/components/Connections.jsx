/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';
import { Link } from 'react-router-dom';

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchConnections();
  }, []);
  
  if (!connections) return null;
  
  if (connections.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-500">
          No Connections Found
        </h1>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 px-2 sm:px-6 md:px-8 bg-gray-100 flex justify-center overflow-y-auto">
      <div className="w-full max-w-md sm:max-w-3xl space-y-6 pb-32 sm:pb-28 md:pb-24">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Connections
        </h1>
        
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;
          
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
              <div className="flex flex-col flex-grow text-center sm:text-left">
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
                
                <p className="text-gray-600 mb-3 line-clamp-3 text-sm sm:text-base">
                  {about || "No description available."}
                </p>
                
                <Link to={"/chat/" + _id} className="w-full sm:w-auto mt-auto">
                  <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto px-4 sm:px-5 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-200">
                    Chat
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;