import { useState, useEffect, useRef } from 'react';

export function DatePicker({ value, onChange, isInvalid = false, id = 'due-date-picker' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [placement, setPlacement] = useState('down'); // 'down' | 'up'
    const containerRef = useRef(null);

    const toggleOpen = () => {
        if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            // If less than 340px below but more than 340px above, open upward
            if (spaceBelow < 340 && spaceAbove > 340) {
                setPlacement('up');
            } else {
                setPlacement('down');
            }
        }
        setIsOpen((prev) => !prev);
    };

    // Parse initial date or default to current date
    const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
    const [viewYear, setViewYear] = useState(initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

    // Update view month/year if value changes externally
    useEffect(() => {
        if (value) {
            const d = new Date(value + 'T00:00:00');
            if (!isNaN(d.getTime())) {
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
            }
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Helper: format Date to YYYY-MM-DD
    const formatDateToYMD = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Preset handlers
    const applyPreset = (daysToAdd) => {
        const d = new Date();
        d.setDate(d.getDate() + daysToAdd);
        onChange(formatDateToYMD(d));
        setIsOpen(false);
    };

    // Calendar navigation
    const prevMonth = (e) => {
        e.stopPropagation();
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const nextMonth = (e) => {
        e.stopPropagation();
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleSelectDay = (day, isCurrentMonth, e) => {
        e.stopPropagation();
        if (!isCurrentMonth) return;
        const selected = new Date(viewYear, viewMonth, day);
        onChange(formatDateToYMD(selected));
        setIsOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setIsOpen(false);
    };

    // Month details
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // Prepare calendar cells
    const calendarCells = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        calendarCells.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
        });
    }

    // Current month days
    const today = new Date();
    const todayYMD = formatDateToYMD(today);

    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const cellDate = new Date(viewYear, viewMonth, day);
        const cellYMD = formatDateToYMD(cellDate);
        calendarCells.push({
            day,
            isCurrentMonth: true,
            isToday: cellYMD === todayYMD,
            isSelected: value === cellYMD,
        });
    }

    // Format display string
    const formatDisplay = () => {
        if (!value) return '';
        const d = new Date(value + 'T00:00:00');
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="custom-datepicker-container" ref={containerRef}>
            {/* Input Trigger Button */}
            <div
                id={id}
                role="button"
                tabIndex={0}
                className={`custom-datepicker-trigger ${isOpen ? 'is-open' : ''} ${isInvalid ? 'is-invalid' : ''}`}
                onClick={toggleOpen}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleOpen();
                    }
                }}
            >
                <div className="trigger-left">
                    <svg className="datepicker-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className={`trigger-text ${!value ? 'placeholder' : ''}`}>
                        {formatDisplay() || 'Select due date...'}
                    </span>
                </div>

                <div className="trigger-right">
                    {value ? (
                        <button
                            type="button"
                            className="btn-clear-date"
                            onClick={handleClear}
                            title="Clear date"
                            aria-label="Clear date"
                        >
                            &times;
                        </button>
                    ) : (
                        <svg className="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Calendar Popover */}
            {isOpen && (
                <div className={`custom-datepicker-popover placement-${placement}`} role="dialog" aria-modal="false">
                    {/* Quick Presets */}
                    <div className="datepicker-presets">
                        <button type="button" className="preset-chip" onClick={() => applyPreset(0)}>
                            Today
                        </button>
                        <button type="button" className="preset-chip" onClick={() => applyPreset(1)}>
                            Tomorrow
                        </button>
                        <button type="button" className="preset-chip" onClick={() => applyPreset(3)}>
                            +3 Days
                        </button>
                        <button type="button" className="preset-chip" onClick={() => applyPreset(7)}>
                            +1 Week
                        </button>
                    </div>

                    {/* Month / Year Header */}
                    <div className="datepicker-nav">
                        <button
                            type="button"
                            className="btn-nav-arrow"
                            onClick={prevMonth}
                            aria-label="Previous month"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        <span className="datepicker-month-title">
                            {monthNames[viewMonth]} {viewYear}
                        </span>

                        <button
                            type="button"
                            className="btn-nav-arrow"
                            onClick={nextMonth}
                            aria-label="Next month"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    {/* Weekdays Row */}
                    <div className="datepicker-weekdays">
                        {weekdays.map((w, idx) => (
                            <span key={idx} className="weekday-label">
                                {w}
                            </span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="datepicker-grid">
                        {calendarCells.map((cell, idx) => (
                            <button
                                key={idx}
                                type="button"
                                disabled={!cell.isCurrentMonth}
                                className={`calendar-day-btn ${!cell.isCurrentMonth ? 'other-month' : ''} ${
                                    cell.isToday ? 'is-today' : ''
                                } ${cell.isSelected ? 'is-selected' : ''}`}
                                onClick={(e) => handleSelectDay(cell.day, cell.isCurrentMonth, e)}
                            >
                                {cell.day}
                            </button>
                        ))}
                    </div>

                    {/* Popover Footer */}
                    <div className="datepicker-footer">
                        <button type="button" className="datepicker-btn-text" onClick={handleClear}>
                            Clear
                        </button>
                        <button
                            type="button"
                            className="datepicker-btn-primary"
                            onClick={() => applyPreset(0)}
                        >
                            Set to Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
