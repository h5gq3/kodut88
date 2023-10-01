import React, { useState } from "react";
import "twind/shim";
import CountrySelect from "./components/CountrySelect";
import TimeDisplay from "./components/TimeDisplay";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  return (
    <div className="inline-block bg-white shadow-md rounded-lg p-4 m-4">
      <h1 className="text-xl font-bold dark:text-white m-2 mb-4">
        country time zones
      </h1>
      <CountrySelect setSelectedCountryProp={setSelectedCountry} />
      <TimeDisplay selectedCountry={selectedCountry} />
    </div>
  );
}

export default App;
