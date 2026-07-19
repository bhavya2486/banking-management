import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getProfile,
  updateProfile,
} from "../services/userService";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile(user.id);

      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        profileImage: res.data.profileImage || "",
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfile(user.id, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        profileImage: profile.profileImage,
      });

      // Update local storage so changes propagate immediately
      const updatedUser = {
        ...user,
        name: profile.name,
        profileImage: profile.profileImage,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage(res.data.message);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);
      setMessage("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex bg-slate-950 text-slate-100 min-h-screen">
        <Sidebar />

        <div className="ml-64 flex-1 flex flex-col">
          <Navbar />

          <div className="p-8 flex-grow flex items-center justify-center">
            <h1 className="text-xl font-semibold animate-pulse text-slate-400">Loading Profile...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-black mb-8 text-slate-100 tracking-tight">
            Profile Management
          </h1>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 shadow-xl backdrop-blur-md max-w-3xl">
            {message && (
              <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-semibold animate-pulse">
                ✓ {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
               {/* Avatar Preview */}
               <div className="flex flex-col items-center pb-6 border-b border-slate-800/60 mb-6">
                 <img
                   src={profile.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || 'User'}`}
                   alt="Profile Avatar"
                   className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-md mb-3"
                 />
                 <label className="cursor-pointer bg-slate-800/85 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-all mb-4">
                   Upload New Photo
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="hidden"
                   />
                 </label>
                 <span className="text-sm font-semibold text-slate-200">{profile.name}</span>
                 <span className="text-xs text-slate-400">{profile.email}</span>
               </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-655 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-400 focus:bg-slate-950 outline-none text-sm font-medium opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-655 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-655 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-755 text-white font-semibold p-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-200 ease-in-out cursor-pointer text-center"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}