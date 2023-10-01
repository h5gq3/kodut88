import React, { useEffect, useState } from "react";
import { DateTime } from "luxon"; // Using Luxon for time handling

interface TimeDisplayProps {
  selectedCountry: string;
}

interface TimezoneData {
  timezone: string;
}

// `GMT+1` is an alias for `Etc/GMT-1`
// luxon understands the latter only, so we need to
// create converstion between `GMT+1` and `Etc/GMT-1` formats
function convertGMTToEtcGMT(gmtString: string): string | null {
  try {
    // Extract the GMT offset value from the input string
    const offsetMatch = gmtString.match(/[+-]\d+/);

    if (offsetMatch) {
      const offset = parseInt(offsetMatch[0]);

      // Determine the sign (plus or minus) from the input string
      const sign = gmtString.includes("+") ? "-" : "+";

      // Create the Etc/GMT time zone string with the offset and opposite sign
      const etcGMTString = `Etc/GMT${sign}${offset}`;

      return etcGMTString;
    } else {
      throw new Error("Invalid input format");
    }
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

function TimeDisplay({ selectedCountry }: TimeDisplayProps) {
  const [localTime, setLocalTime] = useState<string>("");
  let intervalId: NodeJS.Timeout | null = null; // Declare the interval variable

  useEffect(() => {
    if (selectedCountry) {
      // Fetch the timezone of the selected country from your backend API
      fetch(`/api/timezone/${selectedCountry}`)
        .then((response) => response.json())
        .then((data: TimezoneData) => {
          // Calculate local time using Luxon
          const etcGMT = convertGMTToEtcGMT(data.timezone);
          if (etcGMT) {
            const localDateTime = DateTime.now().setZone(etcGMT);
            setLocalTime(
              localDateTime.toLocaleString(DateTime.TIME_WITH_SECONDS)
            );

            intervalId = setInterval(() => {
              const localDateTime = DateTime.now().setZone(etcGMT);
              setLocalTime(
                localDateTime.toLocaleString(DateTime.TIME_WITH_SECONDS)
              );
            }, 1000);
          } else throw new Error("Wrong timezone response from server");
        })
        .catch((error) => console.error("Error fetching timezone:", error));
    } else {
      setLocalTime("");
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedCountry]);

  return (
    <div className="m-2 mt-4">
      <h2 className="text-lg font-semibold mb-2">local time:</h2>
      <p className="text-4xl">{localTime}</p>
    </div>
  );
}

export default TimeDisplay;
