import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.response?.data || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 px-4 sm:px-6 md:px-8 py-6 bg-gray-50 min-h-screen">
        {/* Form */}
        <div className="w-full max-w-md bg-base-300 shadow-xl rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Edit Profile
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="font-medium mb-1">First Name:</span>
              <input
                type="text"
                value={firstName}
                className="input input-bordered w-full"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="font-medium mb-1">Last Name:</span>
              <input
                type="text"
                value={lastName}
                className="input input-bordered w-full"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="font-medium mb-1">Photo URL:</span>
              <input
                type="text"
                value={photoUrl}
                className="input input-bordered w-full"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="font-medium mb-1">Age:</span>
              <input
                type="text"
                value={age}
                className="input input-bordered w-full"
                onChange={(e) => setAge(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="font-medium mb-1">Gender:</span>
              <input
                type="text"
                value={gender}
                className="input input-bordered w-full"
                onChange={(e) => setGender(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="font-medium mb-1">About:</span>
              <input
                type="text"
                value={about}
                className="input input-bordered w-full"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              className="btn btn-primary mt-2 w-full py-2 sm:py-2.5 text-base"
              onClick={saveProfile}
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="w-full max-w-md flex justify-center">
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about }}
          />
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="alert alert-success shadow-lg">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
