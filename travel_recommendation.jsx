import React, { useState, useEffect } from 'react';

function TravelRecommendation() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch('travel_recommendation.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  const handleSearch = () => {
    const results = data.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
  };

  const handleClear = () => {
    setQuery('');
    setFiltered([]);
  };

  return (
    <div>
      <h1>Travel Recommendations</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter keyword" />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClear}>Clear</button>

      <div>
        {filtered.map(item => (
          <div key={item.name}>
            <h3>{item.name}</h3>
            <p><strong>Location:</strong> {item.location}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelRecommendation;
