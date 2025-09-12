import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const MyProfile = () => {
  const { userData, setUserData, token, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [focusedField, setFocusedField] = useState("");

  if (!userData) return null;

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append(
        "address",
        JSON.stringify({ line1: userData.address.line1, line2: userData.address.line2 })
      );
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(data.message);

        // Update frontend state immediately
        setUserData((prev) => ({
          ...prev,
          name: userData.name,
          phone: userData.phone,
          address: { ...userData.address },
          gender: userData.gender,
          dob: userData.dob,
          image: image ? URL.createObjectURL(image) : prev.image,
        }));

        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4 text-sm text-neutral-800">
      {/* Profile Image */}
      {isEdit ? (
        <label htmlFor="image" className="inline-block relative cursor-pointer">
          <img
            className="w-36 rounded opacity-75"
            src={image ? URL.createObjectURL(image) : userData.image}
            alt="Profile"
          />
          <img
            className="w-10 absolute bottom-12 right-12"
            src={image ? "" : assets.upload_icon}
            alt=""
          />
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="Profile" />
      )}

      {/* Name */}
      <div className="flex items-center gap-6">
        {isEdit ? (
          <input
            className={`text-3xl font-medium outline-none border rounded px-2 py-1 ${
              focusedField === "name" ? "bg-gray-100" : "bg-gray-50"
            }`}
            type="text"
            value={userData.name}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField("")}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="font-medium text-3xl">{userData.name}</p>
        )}
      </div>

      <hr className="bg-zinc-400 h-[1px] border-none" />

      {/* Contact Info */}
      <div>
        <p className="text-neutral-500 underline font-semibold mb-2">
          CONTACT INFORMATION
        </p>

        <div className="flex gap-2 mb-2">
          <p className="w-32 font-medium">Email Address:</p>
          <p className="text-blue-600">{userData.email}</p>
        </div>

        <div className="flex gap-2 mb-2 items-center">
          <p className="w-32 font-medium">Phone Number:</p>
          {isEdit ? (
            <input
              className={`flex-1 border rounded px-2 py-1 outline-none ${
                focusedField === "phone" ? "bg-gray-100" : "bg-gray-50"
              }`}
              type="text"
              value={userData.phone}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField("")}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-600">{userData.phone}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex gap-2 mb-2">
          <p className="w-32 font-medium">Address:</p>
          {isEdit ? (
            <div className="flex flex-col flex-1 gap-1">
              <input
                className={`border rounded px-2 py-1 outline-none ${
                  focusedField === "line1" ? "bg-gray-100" : "bg-gray-50"
                }`}
                placeholder="Street"
                value={userData.address.line1}
                onFocus={() => setFocusedField("line1")}
                onBlur={() => setFocusedField("")}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <input
                className={`border rounded px-2 py-1 outline-none ${
                  focusedField === "line2" ? "bg-gray-100" : "bg-gray-50"
                }`}
                placeholder="City"
                value={userData.address.line2}
                onFocus={() => setFocusedField("line2")}
                onBlur={() => setFocusedField("")}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </div>
          ) : (
            <div>
              <p>{userData.address.line1}</p>
              <p>{userData.address.line2}</p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="text-neutral-500 underline font-semibold mb-2">
          BASIC INFORMATION
        </p>

        <div className="flex gap-2 mb-2 items-center">
          <p className="w-32 font-medium">Gender:</p>
          {isEdit ? (
            <select
              className={`border rounded px-2 py-1 outline-none hover:bg-blue-100 ${
                focusedField === "gender" ? "bg-gray-100" : "bg-gray-50"
              }`}
              value={userData.gender}
              onFocus={() => setFocusedField("gender")}
              onBlur={() => setFocusedField("")}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <p className="w-32 font-medium">D.O.B:</p>
          {isEdit ? (
            <input
              className={`border rounded px-2 py-1 outline-none ${
                focusedField === "dob" ? "bg-gray-100" : "bg-gray-50"
              }`}
              type="date"
              value={userData.dob}
              onFocus={() => setFocusedField("dob")}
              onBlur={() => setFocusedField("")}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p>{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Edit / Save Button */}
      <div className="mt-4">
        <button
          className="border border-primary px-8 py-2 rounded-full hover:text-white hover:bg-[#189d01]"
          onClick={() => {
            if (isEdit) {
              updateUserProfileData();
            } else {
              setIsEdit(true);
            }
          }}
        >
          {isEdit ? "Save Information" : "Edit"}
        </button>
      </div>
    </div>
  );
};
