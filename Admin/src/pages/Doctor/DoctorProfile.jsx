import React, { useEffect, useState, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  // useState returns an array
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  // fallback backend URL in case backendUrl is undefined
  const baseUrl = backendUrl || import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  const updateProfile = async () => {
    try {
      setLoading(true)
      // build payload
      const updateData = {
        docId: profileData._id,  
        image: profileData.image,
        name: profileData.name,
        degree: profileData.degree,
        speciality: profileData.speciality,
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }

      const res = await axios.post(
        `${baseUrl}/api/doctor/update-profile`,
        updateData,
        {
           headers: {
          Authorization: `Bearer ${dToken}`   // ← FIXED
    }
        }
      )

      const data = res.data

      if (data.success) {
        toast.success(data.message || 'Profile updated')
        setIsEdit(false)
        await getProfileData()
      } else {
        toast.error(data.message || 'Update failed')
      }
    } catch (error) {
      // axios error may have response.data.message
      const msg = error?.response?.data?.message || error.message || 'Update failed'
      toast.error(msg)
      console.error('updateProfile error:', error)
    } finally {
      setLoading(false)
    }
  }

  // safe guard if profileData not ready
  if (!profileData) return null

  return (
    <div>
      <div className="flex flex-col gap-4 m-5">
        <div>
          {isEdit ? (
            <input
              type="text"
              className="w-full sm:max-w-64 rounded-lg border p-2"
              onChange={(e) => setProfileData(prev => ({ ...prev, image: e.target.value }))}
              value={profileData.image || ''}
              placeholder="Image URL"
            />
          ) : (
            <img
              className="bg-[#189d01] w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt={profileData.name || 'doctor avatar'}
            />
          )}
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white ">
          {/* name */}
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {isEdit ? (
              <input
                type="text"
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                value={profileData.name || ''}
                className="border-b"
              />
            ) : (
              profileData.name
            )}
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    onChange={(e) => setProfileData(prev => ({ ...prev, degree: e.target.value }))}
                    value={profileData.degree || ''}
                    className="mr-2"
                    placeholder="Degree"
                  />
                  -
                  <input
                    type="text"
                    onChange={(e) => setProfileData(prev => ({ ...prev, speciality: e.target.value }))}
                    value={profileData.speciality || ''}
                    className="ml-2"
                    placeholder="Speciality"
                  />
                </>
              ) : (
                <>
                  {profileData.degree} - {profileData.speciality}
                </>
              )}
            </p>

            <button className="py-0.5 px-2 border text-xs rounded-full ">
              {profileData.experience || '—'}
            </button>
          </div>

          {/* About */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About:</p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                  value={profileData.about || ''}
                  className="w-full"
                />
              ) : (
                profileData.about || '—'
              )}
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment Fee : <span className="text-gray-800">{currency} {isEdit ? (
              <input
                type="number"
                onChange={(e) => setProfileData(prev => ({ ...prev, fees: Number(e.target.value) }))}
                value={profileData.fees ?? ''}
                className="w-24"
              />
            ) : (
              profileData.fees ?? '—'
            )}</span>
          </p>

          <div className="flex gap-2 py-2">
            <p>Address:</p>
            <p className="text-sm">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...(prev.address || {}), line1: e.target.value } }))}
                    value={profileData.address?.line1 || ''}
                    placeholder="Line 1"
                    className="mb-1"
                  />
                  <br />
                  <input
                    type="text"
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...(prev.address || {}), line2: e.target.value } }))}
                    value={profileData.address?.line2 || ''}
                    placeholder="Line 2"
                  />
                </>
              ) : (
                <>
                  {profileData.address?.line1 || '—'}
                  <br />
                  {profileData.address?.line2 || ''}
                </>
              )}
            </p>
          </div>

          <div className="flex gap-1 pt-2 items-center">
            <input
              type="checkbox"
              checked={!!profileData.available}
              onChange={() => {
                if (isEdit) {
                  setProfileData(prev => ({ ...prev, available: !prev.available }))
                }
              }}
            />
            <label>Available</label>
          </div>

          <div className="mt-5">
            {isEdit ? (
              <>
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="px-4 py-1 border border-[#189d01] text-sm rounded-full mr-3 hover:bg-[#189d01] hover:text-white transition-all"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false)
                    // option: reload original data to discard edits
                    getProfileData()
                  }}
                  className="px-4 py-1 border text-sm rounded-full hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-[#189d01] text-sm rounded-full hover:bg-[#189d01] hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile