import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
require("react-datepicker/dist/react-datepicker.css");


const DateTime = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        className="red-border"
        calendarClassName="rasta-stripes"
        />
    );
}

export default DateTime;