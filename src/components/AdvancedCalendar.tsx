import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { TimeSlot } from '../types';

interface AdvancedCalendarProps {
  availability: TimeSlot[];
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
}

export default function AdvancedCalendar({ availability, onSlotSelect, selectedSlot }: AdvancedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availability.filter(slot => slot.date === dateStr);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-gray-900">Select Date & Time</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-gray-900 min-w-[200px] text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2" />;
          }
          
          const dayAvailability = getAvailabilityForDate(day);
          const hasAvailability = dayAvailability.some(slot => slot.isAvailable);
          const isToday = day.toDateString() === new Date().toDateString();
          const isPast = day < new Date();
          
          return (
            <div
              key={index}
              className={`p-2 text-center cursor-pointer rounded-lg transition-colors ${
                isPast 
                  ? 'text-gray-300 cursor-not-allowed'
                  : hasAvailability
                  ? 'hover:bg-blue-50 text-gray-900'
                  : 'text-gray-400'
              } ${isToday ? 'bg-blue-100 font-semibold' : ''}`}
            >
              <div className="text-sm">{day.getDate()}</div>
              {hasAvailability && !isPast && (
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time Slots */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Clock size={16} className="mr-2" />
          Available Time Slots
        </h4>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {timeSlots.map(time => {
            const isAvailable = availability.some(slot => 
              slot.startTime === time && slot.isAvailable
            );
            const slot = availability.find(s => s.startTime === time);
            const isSelected = selectedSlot?.startTime === time;
            
            return (
              <button
                key={time}
                onClick={() => slot && onSlotSelect(slot)}
                disabled={!isAvailable}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isAvailable
                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {time}
                {slot?.price && (
                  <div className="text-xs mt-1">
                    ${slot.price}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {availability.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p>No time slots available</p>
            <p className="text-sm">Please contact the venue owner</p>
          </div>
        )}
      </div>
    </div>
  );
}