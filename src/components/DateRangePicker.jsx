// DateRangePicker.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Icon } from '@iconify/react';

function DateRangePicker({ onChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (onChange) {
      onChange({ start, end });
    }
  };

  return (
    <div
      className="d-flex align-items-center border rounded px-3 py-2 bg-white"
      style={{ maxWidth: 420 }}
    >
      {/* 開始日期 */}
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        placeholderText="開始日期"
        className="form-control border-0"
      />

      {/* 箭頭 icon */}
      <Icon icon="tdesign:swap-right" width="16" height="16" className="mx-2 text-secondary" />

      {/* 結束日期 */}
      <DatePicker
        selected={endDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        placeholderText="結束日期"
        className="form-control border-0"
      />

      <Icon icon="uit:calender" width="16" height="16" />
    </div>
  );
}

export default DateRangePicker;
