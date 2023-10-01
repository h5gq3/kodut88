import React, { useState, useEffect, ChangeEvent } from "react";

interface Country {
  id: number;
  country: string;
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
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedCountryProp(country);
  };

  return (
    <div className="m-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="countrySelect"
      >
        select a country:
      </label>
      <select
        className="w-full border rounded p-2"
        id="countrySelect"
        onChange={handleCountryChange}
        value={selectedCountry}
      >
        <option value="">select a country</option>
        {countries.map((country) => (
          <option key={country.id} value={country.country}>
            {country.country}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySelect;
