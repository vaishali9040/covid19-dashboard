import React, { useState, useEffect, useRef } from 'react';
import '../style/SearchDropdown.css';
import Charts from './Charts';

function SearchDropdown() {
  const [input, setInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [historicalData, setHistoricalData] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalRecovered, setTotalRecovered] = useState(0);

  useEffect(() => {
    // Fetch country options from the API
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        // Extract country names and codes
        const options = data.map(country => ({
          name: country.name.common,
          code: country.cca2
        }));
        // Set the country options state
        setCountryOptions(options);
      })
      .catch(error => console.error('Error fetching country options:', error));
  }, []);

  // Function to fetch historical COVID-19 data for a given country
  const fetchHistoricalData = (countryCode) => {
    fetch(`https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=1500`)
      .then(response => response.json())
      .then(data => {
        // Set the historical data state
        setHistoricalData(data);

        // Calculate total cases, deaths, and recoveries
        let cases = 0;
        let deaths = 0;
        let recovered = 0;

        if (data.timeline) {
          const timeline = data.timeline;

          Object.keys(timeline.cases).forEach(date => {
            cases += timeline.cases[date];
          });

          Object.keys(timeline.deaths).forEach(date => {
            deaths += timeline.deaths[date];
          });

          Object.keys(timeline.recovered).forEach(date => {
            recovered += timeline.recovered[date];
          });
        }

        // Set total cases, deaths, and recoveries
        setTotalCases(cases);
        setTotalDeaths(deaths);
        setTotalRecovered(recovered);
      })
      .catch(error => console.error('Error fetching historical data:', error));
  };

  // Filter countries based on input or show all if input is empty
  const filteredCountries = input.trim() === '' 
    ? countryOptions 
    : countryOptions.filter(country =>
        country.name.toLowerCase().includes(input.toLowerCase())
      );

  // Function to handle document click
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  // Add click event listener on mount
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to handle country selection
  const handleCountrySelection = (country) => {
    setInput(country.name);
    setIsVisible(false);
    fetchHistoricalData(country.code);
  };

  return (
    <div className="search-container">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a country..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsVisible(true);
          }}
          onFocus={() => {
            setIsVisible(true);
          }}
        />
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1112 0A6 6 0 012 8z" clipRule="evenodd" />
          <path d="M12.293 12.707a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414z" />
        </svg>
      </div>
      {isVisible && (
        <ul ref={dropdownRef} className="dropdown-menu">
          {filteredCountries.map((country, index) => (
            <li key={index} onClick={() => handleCountrySelection(country)} role="button" tabIndex="0">
              {country.name}
            </li>
          ))}
        </ul>
      )}
      <Charts
        totalCases={totalCases}
        totalRecovered={totalRecovered}
        totalDeaths={totalDeaths}
      />
    </div>
  );
}

export default SearchDropdown;
