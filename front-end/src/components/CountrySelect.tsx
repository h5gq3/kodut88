import React, { useState, useEffect, ChangeEvent } from "react";

interface Country {
  id: number;
  country_name: string;
}

interface CountrySelectProps {
  setSelectedCountryProp: (countryId: string) => void;
}

function CountrySelect({ setSelectedCountryProp }: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  useEffect(() => {
    // Fetch the list of countries from your backend API
    fetch("/api/countries")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Handle country selection
  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const countryId = event.target.value;
    setSelectedCountry(countryId);
    setSelectedCountryProp(countryId);
  };

  return (
    <div>
      <label htmlFor="countrySelect">Select a Country:</label>
      <select
        id="countrySelect"
        onChange={handleCountryChange}
        value={selectedCountry}
      >
        <option value="">Select a country</option>
        {countries.map((country) => (
          <option key={country.id} value={country.id.toString()}>
            {country.country_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySelect;
