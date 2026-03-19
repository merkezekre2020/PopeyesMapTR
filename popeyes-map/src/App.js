import React, { useState, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import branches from './data/branches.json';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const popeyesIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48"><path d="M18 0C8.06 0 0 8.06 0 18c0 12 18 30 18 30s18-18 18-30C36 8.06 27.94 0 18 0z" fill="#D32F2F"/><circle cx="18" cy="17" r="9" fill="#fff"/><text x="18" y="21" text-anchor="middle" font-size="10" font-weight="bold" fill="#D32F2F" font-family="Arial">P</text></svg>`),
  iconRetinaUrl: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48"><path d="M18 0C8.06 0 0 8.06 0 18c0 12 18 30 18 30s18-18 18-30C36 8.06 27.94 0 18 0z" fill="#D32F2F"/><circle cx="18" cy="17" r="9" fill="#fff"/><text x="18" y="21" text-anchor="middle" font-size="10" font-weight="bold" fill="#D32F2F" font-family="Arial">P</text></svg>`),
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -38],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [38, 38],
  shadowAnchor: [12, 38],
});

function FlyToMarker({ branch, markerRefs }) {
  const map = useMap();
  if (branch) {
    const lat = parseFloat(branch.lat);
    const lng = parseFloat(branch.lng);
    map.flyTo([lat, lng], 16, { duration: 0.8 });
    setTimeout(() => {
      const key = `${lat}-${lng}`;
      const marker = markerRefs.current[key];
      if (marker) marker.openPopup();
    }, 900);
  }
  return null;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [flyTarget, setFlyTarget] = useState(null);
  const [cityGroup, setCityGroup] = useState(null);
  const markerRefs = useRef({});

  const cities = useMemo(() => {
    const citySet = new Set(branches.map(b => b.data.city));
    return [...citySet].sort((a, b) => a.localeCompare(b, 'tr'));
  }, []);

  const cityCounts = useMemo(() => {
    const counts = {};
    branches.forEach(b => {
      counts[b.data.city] = (counts[b.data.city] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        b.data.title.toLowerCase().includes(q) ||
        b.data.address.toLowerCase().includes(q) ||
        b.data.city.toLowerCase().includes(q) ||
        b.data.county.toLowerCase().includes(q);
      const matchesCity = !selectedCity || b.data.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [searchTerm, selectedCity]);

  const handleBranchClick = useCallback((branch) => {
    setFlyTarget(branch);
    setCityGroup(null);
    setSearchTerm('');
    setSelectedCity('');
  }, []);

  const setMarkerRef = useCallback((ref, lat, lng) => {
    if (ref) {
      markerRefs.current[`${lat}-${lng}`] = ref;
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#D32F2F"/>
              <path d="M14 12h4c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4V12z" fill="#fff"/>
              <path d="M14 16h3.5c1.4 0 2.5 1.1 2.5 2.5S18.9 21 17.5 21H14V16z" fill="#D32F2F"/>
            </svg>
            <span>Popeyes Türkiye</span>
          </div>
        </div>
        <div className="header-right">
          <span className="branch-count">{filteredBranches.length} / {branches.length} şube</span>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="search-section">
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Şube, adres veya ilçe ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>
            <select
              className="city-select"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              <option value="">Tüm Şehirler ({branches.length})</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city} ({cityCounts[city]})
                </option>
              ))}
            </select>
          </div>

          <div className="branch-list">
            {filteredBranches.length === 0 ? (
              <div className="no-results">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>Sonuç bulunamadı</p>
              </div>
            ) : (
              filteredBranches.map((branch, idx) => (
                <div
                  key={`${branch.data.title}-${idx}`}
                  className="branch-card"
                  onClick={() => handleBranchClick(branch)}
                >
                  <div className="branch-card-header">
                    <span className="branch-name">{branch.data.title}</span>
                  </div>
                  <div className="branch-card-detail">
                    <span className="branch-city">{branch.data.city}</span>
                    <span className="branch-county">{branch.data.county}</span>
                  </div>
                  <div className="branch-card-address">
                    {branch.data.address.trim()}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="map-wrapper">
          <MapContainer
            center={[39.0, 35.0]}
            zoom={6}
            className="map-container"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToMarker branch={flyTarget} markerRefs={markerRefs} />

            {filteredBranches.map((branch, idx) => {
              const lat = parseFloat(branch.lat);
              const lng = parseFloat(branch.lng);
              if (isNaN(lat) || isNaN(lng)) return null;
              return (
                <Marker
                  key={`${branch.data.title}-${idx}`}
                  position={[lat, lng]}
                  icon={popeyesIcon}
                  ref={ref => setMarkerRef(ref, lat, lng)}
                >
                  <Popup>
                    <div className="popeyes-popup">
                      <h3>{branch.data.title}</h3>
                      <div className="popup-detail">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{branch.data.address.trim()}</span>
                      </div>
                      <div className="popup-detail">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        <span>444 76 77</span>
                      </div>
                      <div className="popup-tags">
                        <span className="popup-tag city">{branch.data.city}</span>
                        <span className="popup-tag county">{branch.data.county}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {cityGroup && (
            <div className="city-group-overlay">
              <div className="city-group-panel">
                <div className="city-group-header">
                  <h3>{cityGroup.city} ({cityGroup.branches.length} şube)</h3>
                  <button onClick={() => setCityGroup(null)}>×</button>
                </div>
                <div className="city-group-list">
                  {cityGroup.branches.map((b, i) => (
                    <div
                      key={i}
                      className="branch-card"
                      onClick={() => {
                        setFlyTarget(b);
                        setCityGroup(null);
                      }}
                    >
                      <div className="branch-card-header">
                        <span className="branch-name">{b.data.title}</span>
                      </div>
                      <div className="branch-card-detail">
                        <span className="branch-county">{b.data.county}</span>
                      </div>
                      <div className="branch-card-address">{b.data.address.trim()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
