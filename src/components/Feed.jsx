import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import UserCard from './UserCard';
import { addFeed } from '../utils/feedSlice';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length <= 0) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2">
            No New Users
          </h1>
          <p className="text-gray-500">Check back later for new profiles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 pb-24 sm:pb-32 min-h-screen">
      <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Discover People
        </h1>

        {/* User card */}
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
