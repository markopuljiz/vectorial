import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  id?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Select date', id }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="date-picker-wrapper" ref={wrapperRef}>
      <div 
        className="date-input-display" 
        onClick={() => setIsOpen(!isOpen)}
        id={id}
      >
        {value ? formatDateForDisplay(value) : placeholder}
      </div>
      
      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="date-picker-header">
            <button type="button" onClick={goToPreviousMonth} className="date-picker-nav">◀</button>
            <span className="date-picker-month-year">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button type="button" onClick={goToNextMonth} className="date-picker-nav">▶</button>
          </div>
          
          <div className="date-picker-calendar">
            <div className="date-picker-weekdays">
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
              <div>Su</div>
            </div>
            
            <div className="date-picker-days">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index}>
                  {date ? (
                    <button
                      type="button"
                      onClick={() => handleDateClick(date)}
                      className={`date-picker-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div className="date-picker-day empty"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
