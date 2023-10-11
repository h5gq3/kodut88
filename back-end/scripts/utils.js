const { DateTime } = require("luxon");

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
}

function convertGMTToEtcGMT(gmtString) {
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
  } catch (error) {
    console.error(error);
    return null;
  }
}

// function to get the current local time for a location
function getCurrentLocalTime(timezone) {
  // use Luxon to get the current time based on latitude and longitude
  const etcGMT = convertGMTToEtcGMT(timezone);
  if (etcGMT) {
    const now = DateTime.now().setZone(etcGMT);
    return now.toLocaleString(DateTime.DATETIME_SHORT);
  }
}

module.exports = {
  calculateDistance,
  convertGMTToEtcGMT,
  getCurrentLocalTime,
};
