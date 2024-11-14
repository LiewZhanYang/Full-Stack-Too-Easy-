import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [customerData, setCustomerData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null); // For new profile picture uploads
  const [children, setChildren] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const userId = localStorage.getItem("userId");

  const toggleEditMode = () => {
    if (isEditing) {
      handleSaveDetails(); // Save details when exiting edit mode
    }
    setIsEditing(!isEditing);
  };

  const handleSaveDetails = async () => {
    try {
      const formData = new FormData();
      formData.append("Name", customerData.Name);
      formData.append("ContactNo", customerData.ContactNo);
      formData.append("EmailAddr", customerData.EmailAddr);

      // Add profile picture if it exists
      if (profilePicture) {
        formData.append("file", profilePicture); // Append the profile picture
      }

      await axios.put(`http://localhost:8000/customer/id/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update profile picture preview if a new file is selected
      if (profilePicture) {
        const reader = new FileReader();
        reader.onload = () => {
          setCustomerData((prevData) => ({
            ...prevData,
            ProfilePicturePreview: reader.result, // Update preview
          }));
        };
        reader.readAsDataURL(profilePicture);
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/customer/id/${userId}`
        );
        if (response.data && response.data.length > 0) {
          const customer = response.data[0];
          setCustomerData(customer);

          // If a profile picture URL is available, set it for preview
          if (customer.ProfilePictureURL) {
            setCustomerData((prevData) => ({
              ...prevData,
              ProfilePicturePreview: customer.ProfilePictureURL,
            }));
          }
          setProfilePicture(null); // Clear any previous profile picture
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    const fetchChildrenData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/children/${userId}`
        );
        if (response.data) {
          setChildren(
            response.data.map((child) => ({
              id: child.ChildID,
              fullName: child.Name,
              dateOfBirth: child.DOB.split("T")[0],
              strengths: child.Strength,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching children data:", error);
      }
    };

    fetchCustomerData();
    fetchChildrenData();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicture(file);

      // Optional: Preview the uploaded image
      const reader = new FileReader();
      reader.onload = () => {
        setCustomerData((prevData) => ({
          ...prevData,
          ProfilePicturePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleAddChild = () => {
    setChildren([
      ...children,
      { id: null, fullName: "", dateOfBirth: "", strengths: "" },
    ]);
  };

  const handleChildInputChange = (index, field, value) => {
    setChildren((prevChildren) =>
      prevChildren.map((child, idx) =>
        idx === index ? { ...child, [field]: value } : child
      )
    );
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSaveChild = async (child, index) => {
    const childData = {
      Name: child.fullName,
      Strength: child.strengths,
      DOB: child.dateOfBirth,
      Age: calculateAge(child.dateOfBirth),
      AccountID: userId,
    };

    try {
      if (child.id) {
        await axios.put(
          `http://localhost:8000/children/${child.id}`,
          childData
        );
        alert("Child updated successfully!");
      } else {
        const response = await axios.post(
          `http://localhost:8000/children`,
          childData
        );
        if (response.data.child?.id) {
          setChildren((prevChildren) => {
            const newChildren = [...prevChildren];
            newChildren[index] = {
              ...newChildren[index],
              id: response.data.child.id,
            };
            return newChildren;
          });
          alert("Child added successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving child information:", error);
      alert("Failed to save child information.");
    }
  };

  const handleDeleteChild = async (childId) => {
    try {
      await axios.delete(`http://localhost:8000/children/${childId}`);
      setChildren((prevChildren) =>
        prevChildren.filter((child) => child.id !== childId)
      );
      alert("Child deleted successfully!");
    } catch (error) {
      console.error("Error deleting child:", error);
      alert("Failed to delete child.");
    }
  };

  return (
    <div className="flex-1 p-8 -ml-30">
      <h1 className="text-2xl font-semibold mb-8">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <div className="flex items-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {customerData?.ProfilePicturePreview ? (
              <img
                src={customerData.ProfilePicturePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture:
            </label>
            <div className="relative w-full">
              <button
                type="button"
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
                  isEditing ? "" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() =>
                  document.getElementById("profilePictureInput").click()
                }
                disabled={!isEditing}
              >
                Choose File
              </button>
              <span className="ml-4 text-gray-600">
                {profilePicture ? profilePicture.name : "No file selected"}
              </span>
              <input
                id="profilePictureInput"
                type="file"
                onChange={handleProfilePictureChange}
                disabled={!isEditing}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name:
              </label>
              <input
                type="text"
                value={customerData?.Name || ""}
                onChange={(e) => handleInputChange("Name", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border ${
                  isEditing
                    ? "border-gray-300"
                    : "border-transparent bg-gray-100"
                } rounded-md`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                value={customerData?.ContactNo || ""}
                onChange={(e) => handleInputChange("ContactNo", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border ${
                  isEditing
                    ? "border-gray-300"
                    : "border-transparent bg-gray-100"
                } rounded-md`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address:
            </label>
            <input
              type="email"
              value={customerData?.EmailAddr || ""}
              onChange={(e) => handleInputChange("EmailAddr", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent bg-gray-100"
              } rounded-md`}
            />
          </div>

          {/* Membership Info (Non-Editable) */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membership Expiry:
              </label>
              <input
                type="date"
                value={
                  customerData?.MembershipExpiry
                    ? new Date(customerData.MembershipExpiry)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                disabled // Non-editable field
                className="w-full px-3 py-2 border border-transparent bg-gray-100 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Status:
              </label>
              <input
                type="text"
                value={customerData?.MemberStatus === 1 ? "Active" : "Inactive"}
                disabled // Non-editable field
                className="w-full px-3 py-2 border border-transparent bg-gray-100 rounded-md"
              />
            </div>
          </div>

          <div>
            <button
              onClick={toggleEditMode}
              className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>

      {/* Child Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="font-medium">Add Child Details</span>
          <button
            onClick={handleAddChild}
            className="text-blue-600 text-sm hover:text-blue-700"
          >
            + Add Another Child
          </button>
        </div>

        <div className="space-y-8">
          {children.map((child, index) => (
            <div key={index} className="space-y-6">
              {index > 0 && <div className="border-t pt-6"></div>}
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Child {index + 1}</h3>
                {child.id && (
                  <button
                    onClick={() => handleDeleteChild(child.id)}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    Delete Child
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    value={child.fullName || ""}
                    onChange={(e) =>
                      handleChildInputChange(index, "fullName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    value={child.dateOfBirth || ""}
                    onChange={(e) =>
                      handleChildInputChange(
                        index,
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strengths:
                </label>
                <textarea
                  placeholder="Tell us more about your child"
                  value={child.strengths || ""}
                  onChange={(e) =>
                    handleChildInputChange(index, "strengths", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={() => handleSaveChild(child, index)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                {child.id ? "Update Child" : "Add Child"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
