import React, { useState } from 'react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('Programmes');

  // Get current date and format month/year
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Generate calendar days (4 days including current day)
  const generateCalendarDays = () => {
    const days = [];
    for (let i = -1; i < 3; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      days.push({
        day: date.getDate(),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        current: i === 0,
        date: date
      });
    }
    return days;
  };

  // Generate upcoming events with real dates
  const generateUpcomingEvents = () => {
    const events = [
      { title: 'Public Speaking Workshop', time: '15:00-16:30' },
      { title: 'PSLE Power Up', time: '15:00-16:30' },
      { title: '1 to 1 Coaching', time: '15:00-16:30' },
      { title: 'PSLE Power Up', time: '15:00-16:30' }
    ];

    return events.map((event, index) => {
      const eventDate = new Date();
      eventDate.setDate(currentDate.getDate() + index);
      return {
        ...event,
        date: eventDate.getDate().toString().padStart(2, '0'),
        isToday: index === 0 // First event is today
      };
    });
  };

  const calendarDays = generateCalendarDays();
  const upcomingEvents = generateUpcomingEvents();

  const renderContent = () => {
    return (
      <div className="mb-6">
        <p className="text-gray-600">
          You have not signed up for any {activeTab.toLowerCase()}.
        </p>
        <button className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
          Join
        </button>
      </div>
    );
  };

  return (
    <div className="ml-1 p-4">
      <div className="relative max-w-md mb-8">
        <input
          type="text"
          placeholder="Search for programmes"
          className="w-full px-4 py-2 bg-gray-50 border rounded-md"
        />
        <button className="absolute right-3 top-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex space-x-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Welcome Back, Moni</h1>

          <div className="border-b mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('Programmes')}
                className={`py-2 ${activeTab === 'Programmes' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              >
                Programmes
              </button>
              <button
                onClick={() => setActiveTab('Webinars')}
                className={`py-2 ${activeTab === 'Webinars' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              >
                Webinars
              </button>
            </div>
          </div>

          {renderContent()}
        </div>

        <div className="w-80">
          <div>
            <h2 className="text-lg font-semibold mb-4">{monthYear}</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              {calendarDays.map((date) => (
                <div key={date.label}>
                  <div className="text-sm text-gray-500">{date.label}</div>
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto
                    ${date.current ? 'bg-yellow-500 text-white' : ''}`}>
                    {date.day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index} 
                  className={`flex items-start p-3 rounded-lg transition-all duration-200
                    ${event.isToday 
                      ? 'bg-white shadow-sm border border-gray-100' 
                      : 'bg-gray-50'}`}
                >
                  <div className={`text-xl font-bold w-8 
                    ${event.isToday ? 'text-gray-800' : 'text-gray-400'}`}>
                    {event.date}
                  </div>
                  <div className="ml-4">
                    <div className={`font-medium 
                      ${event.isToday ? 'text-gray-800' : 'text-gray-500'}`}>
                      {event.title}
                    </div>
                    <div className={`text-sm 
                      ${event.isToday ? 'text-gray-600' : 'text-gray-400'}`}>
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;