import React, { useState } from "react";
import CountrySelect from "./components/CountrySelect";
import TimeDisplay from "./components/TimeDisplay";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  return (
    <div>
      <h1>Country Time Zones</h1>
      <CountrySelect setSelectedCountryProp={setSelectedCountry} />
      <TimeDisplay selectedCountry={selectedCountry} />
    </div>
  );
}

export default App;
