import React, { useState } from 'react';  

function Profile() {  
  const MAX_CHILDREN = 2;  
  const [children, setChildren] = useState([  
    {  
      id: 1,  
      fullName: "Chloe Macfield",  
      dateOfBirth: "2013-02-10",  
      strengths: ""  
    }  
  ]);  

  const handleAddChild = () => {  
    if (children.length >= MAX_CHILDREN) {  
      alert("You can only add up to 2 children.");  
      return;  
    }  
    setChildren([...children, {  
      id: children.length + 1,  
      fullName: "",  
      dateOfBirth: "",  
      strengths: ""  
    }]);  
  };  

  const handleRemoveChild = (id) => {  
    setChildren(children.filter(child => child.id !== id));  
  };  

  const handleChildInputChange = (id, field, value) => {  
    setChildren(children.map(child =>   
      child.id === id ? { ...child, [field]: value } : child  
    ));  
  };  

  return (  
    <div className="flex-1 p-8 -ml-30">  
      <h1 className="text-2xl font-semibold mb-8">My Profile</h1>  

      {/* Profile Information */}  
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">  
        {/* Profile Avatar */}  
        <div className="flex items-center mb-8">  
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">  
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />  
            </svg>  
          </div>  
        </div>  

        {/* Personal Information Form */}  
        <div className="space-y-6">  
          <div className="grid grid-cols-2 gap-6">  
            <div>  
              <label className="block text-sm font-medium text-gray-700 mb-1">  
                Full Name:  
              </label>  
              <input  
                type="text"  
                defaultValue="Max Price"  
                className="w-full px-3 py-2 border border-gray-300 rounded-md"  
              />  
            </div>  

            <div>  
              <label className="block text-sm font-medium text-gray-700 mb-1">  
                Phone Number:  
              </label>  
              <input  
                type="tel"  
                defaultValue="+65 8123 4567"  
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
              defaultValue="pricemax@gmail.com"  
              className="w-full px-3 py-2 border border-gray-300 rounded-md"  
            />  
          </div>  

          <div>  
            <button className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors">  
              Confirm  
            </button>  
          </div>  
        </div>  
      </div>  

      {/* Child Information Section */}  
      <div className="bg-white rounded-lg p-6 shadow-sm">  
        <div className="flex items-center justify-between mb-6">  
          <div className="flex items-center gap-2">  
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />  
            </svg>  
            <span className="font-medium">Add Child Details</span>  
          </div>  
          {children.length < MAX_CHILDREN && (  
            <button   
              onClick={handleAddChild}  
              className="text-blue-600 text-sm hover:text-blue-700"  
            >  
              + Add Another Child  
            </button>  
          )}  
        </div>  

        <div className="space-y-8">  
          {children.map((child) => (  
            <div key={child.id} className="space-y-6">  
              {child.id > 1 && (  
                <div className="border-t pt-6"></div>  
              )}  
              <div className="flex justify-between items-center">  
                <h3 className="font-medium">Child {child.id}</h3>  
                {child.id !== 1 && (  
                  <button   
                    onClick={() => handleRemoveChild(child.id)}  
                    className="text-red-600 text-sm hover:text-red-700 flex items-center gap-1"  
                  >  
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />  
                    </svg>  
                    Remove Child  
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
                    value={child.fullName}  
                    onChange={(e) => handleChildInputChange(child.id, 'fullName', e.target.value)}  
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"  
                  />  
                </div>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700 mb-1">  
                    Date of Birth:  
                  </label>  
                  <input  
                    type="date"  
                    value={child.dateOfBirth}  
                    onChange={(e) => handleChildInputChange(child.id, 'dateOfBirth', e.target.value)}  
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
                  value={child.strengths}  
                  onChange={(e) => handleChildInputChange(child.id, 'strengths', e.target.value)}  
                  rows={4}  
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"  
                />  
              </div>  

              <div>  
                <button className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors">  
                  Confirm  
                </button>  
              </div>  
            </div>  
          ))}  
        </div>  
      </div>  
    </div>  
  );  
}  

export default Profile;