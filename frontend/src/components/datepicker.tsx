"use client"

import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  onDateChange: (startDate: Date) => void;
}

export const DatePickerComponent: React.FC<DatePickerProps> = ({
  onDateChange,
}) => {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <DatePicker
      selected={date}
      onChange={handleDateChange}
      className="bg-transparent rounded-[7px] border border-accent-3 p-3"
    />
  );
};