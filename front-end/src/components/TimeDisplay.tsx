import React, { useEffect, useState } from "react";
import { DateTime } from "luxon"; // Using Luxon for time handling

interface TimeDisplayProps {
  selectedCountry: string;
}

interface TimezoneData {
  timezone: string;
}

function TimeDisplay({ selectedCountry }: TimeDisplayProps) {
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    if (selectedCountry) {
      // Fetch the timezone of the selected country from your backend API
      fetch(`/api/timezone/${selectedCountry}`)
        .then((response) => response.json())
        .then((data: TimezoneData) => {
          // Calculate local time using Luxon
          const localDateTime = DateTime.now().setZone(data.timezone);
          setLocalTime(localDateTime.toLocaleString(DateTime.DATETIME_SHORT));
        })
        .catch((error) => console.error("Error fetching timezone:", error));
    } else {
      setLocalTime("");
    }
  }, [selectedCountry]);

  return (
    <div>
      <h2>Local Time:</h2>
      <p>{localTime}</p>
    </div>
  );
}

export default TimeDisplay;
