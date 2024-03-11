import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const App = () => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [holidays, setHolidays] = useState([]);
  const [countries, setCountries] = useState([
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
  ]);
  const [newCountryName, setNewCountryName] = useState('');
  const [error, setError] = useState(null);  

  const fetchHolidays = async () =>  {
    const year = new Date().getFullYear();
    const apiKey = 'V4PBhpPfpNaXo2UI5zDTR5FBellnexRC'; 
    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${selectedCountry}&year=${year}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setHolidays(data.response.holidays);
    } catch (error) {
      console.error('Fetching holidays failed:', error);
      setError('Failed to load holidays. Please try again.'); 
    }
  };

  useEffect(() => {
    fetchHolidays(); 
  }, [selectedCountry]);

  const getMonthlyData = (holidays) => {
    const monthCounts = new Array(12).fill(0); 
    holidays.forEach(holiday => {
      const month = new Date(holiday.date.iso).getMonth(); 
      monthCounts[month]++;
    });
    return monthCounts.map((count, index) => ({
      name: new Date(0, index + 1, 0).toLocaleString('default', { month: 'short' }),
      Holidays: count
    }));
  };

  const addCountry = async () => {
    const countryName = newCountryName.trim();
    if (countryName) {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json();
        const countryCode = data[0].cca2.toLowerCase();
        const isCountryExist = countries.some(country => country.code === countryCode);
        if (!isCountryExist) {
          setCountries([...countries, { code: countryCode, name: countryName }]);
          setNewCountryName('');
        } else {
          alert('Country is already in the list.');
        }
      } catch (error) {
        console.error('Failed to add country:', error);
        alert('Failed to add country. Please try again.');
      }
    } else {
      alert('Please enter a country name.');
    }
  };

  const renderBarChart = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={getMonthlyData(holidays)}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Holidays" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  return (

    
    <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
      <div id="holidaysContainer" style={{ flex: 1 }}>
      <div id="holidaysContainer" style={{ flex: 1 }}>
        <h1>Public Holidays</h1>
        <select id="countrySelect" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          {countries.map((country, index) => (
            <option key={index} value={country.code}>{country.name}</option>
          ))}
        </select>
        <button onClick={fetchHolidays}>Check Holidays</button>

        <div id="addCountryContainer" style={{ marginTop: '20px' }}>
          <input
            type="text"
            value={newCountryName}
            onChange={(e) => setNewCountryName(e.target.value)}
            placeholder="Country Name"
          />
          <button onClick={addCountry}>+</button>
        </div>

        <div id="holidays" style={{ marginTop: '20px' }}>
          {holidays.map((holiday, index) => (
            <div key={index} className="holiday" style={{ padding: '5px', backgroundColor: '#f0f0f0', borderRadius: '5px', marginBottom: '5px' }}>
              {`${holiday.date.iso}: ${holiday.name}`}
            </div>
          ))}
        </div>
      </div>
      </div>
      <div id="visualizationContainer" style={{ flex: 1 }}>
        <h1>Visualization</h1>
        {renderBarChart} {}
      </div>
    </div>
  );
};

export default App;
