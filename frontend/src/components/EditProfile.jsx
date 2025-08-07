import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const EditProfile = ({ currentUser, setShowEditProfile, setCurrentUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || ""
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3333/api/updateprofile/${currentUser._id}`,
        formData,
        { withCredentials: true }
      );
      setCurrentUser(res.data.updatedUser);
      setShowEditProfile(false);
      toast.success('Updated successfully')
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-96 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            placeholder="Name"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            placeholder="Phone"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            placeholder="Email"
            required
          />

          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => setShowEditProfile(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
