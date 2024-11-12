import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [customerData, setCustomerData] = useState(null);
  const [children, setChildren] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/customer/id/${userId}`);
        if (response.data && response.data.length > 0) {
          setCustomerData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    const fetchChildrenData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/children/${userId}`);
        if (response.data) {
          console.log('Fetched children data:', response.data);
          setChildren(
            response.data.map((child) => ({
              id: child.ChildID,
              fullName: child.Name,
              dateOfBirth: child.DOB.split('T')[0],
              strengths: child.Strength,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching children data:', error);
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

  const handleAddChild = () => {
    setChildren([
      ...children,
      { id: null, fullName: '', dateOfBirth: '', strengths: '' },
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
        console.log('Updating child:', childData);
        await axios.put(`http://localhost:8000/children/${child.id}`, childData);
        alert('Child updated successfully!');
      } else {
        console.log('Adding new child:', childData);
        const response = await axios.post(`http://localhost:8000/children`, childData);
        if (response.data.child?.id) {
          setChildren((prevChildren) => {
            const newChildren = [...prevChildren];
            newChildren[index] = { ...newChildren[index], id: response.data.child.id };
            return newChildren;
          });
          alert('Child added successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving child information:', error);
      alert('Failed to save child information.');
    }
  };

  const handleDeleteChild = async (childId) => {
    try {
      console.log('Deleting child with ID:', childId);
      await axios.delete(`http://localhost:8000/children/${childId}`);
      setChildren((prevChildren) => prevChildren.filter((child) => child.id !== childId));
      alert('Child deleted successfully!');
    } catch (error) {
      console.error('Error deleting child:', error);
      alert('Failed to delete child.');
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.put(`http://localhost:8000/customer/id/${userId}`, {
        Name: customerData.Name,
        ContactNo: customerData.ContactNo,
        EmailAddr: customerData.EmailAddr,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="flex-1 p-8 -ml-30">
      <h1 className="text-2xl font-semibold mb-8">My Profile</h1>

      {/* Profile Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <div className="flex items-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name:
              </label>
              <input
                type="text"
                value={customerData?.Name || ''}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                value={customerData?.ContactNo || ''}
                onChange={(e) => handleInputChange('ContactNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address:
            </label>
            <input
              type="email"
              value={customerData?.EmailAddr || ''}
              onChange={(e) => handleInputChange('EmailAddr', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <button
              onClick={handleConfirm}
              className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Child Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="font-medium">Add Child Details</span>
          <button onClick={handleAddChild} className="text-blue-600 text-sm hover:text-blue-700">
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
                    value={child.fullName || ''}
                    onChange={(e) => handleChildInputChange(index, 'fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    value={child.dateOfBirth || ''}
                    onChange={(e) => handleChildInputChange(index, 'dateOfBirth', e.target.value)}
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
                  value={child.strengths || ''}
                  onChange={(e) => handleChildInputChange(index, 'strengths', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={() => handleSaveChild(child, index)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                {child.id ? 'Update Child' : 'Add Child'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
