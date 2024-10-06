import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/about';
import Resources from './pages/Resources';
import NavBar from './components/NavBar';

// Import Google Maps and related components
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin
} from '@vis.gl/react-google-maps';

import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import { Circle } from './components/circle';


// Map Component (previously your main App component)
const MapPage = ({ setLatitude, setLongitude, setCloudCover, setLight, setLabel, setHeight }) => {
  const mapRef = useRef(null); // Reference for the map container

  useEffect(() => {
    const initMap = async () => {
      // Request needed libraries from Google Maps
      const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      const map = new Map(mapRef.current, {
        center: { lat: 38.66, lng: -97.92 },
        zoom: 5,
        mapId: '4504f8b37365c3d0',
      });

      const getElevation = async (latitude, longitude) => {
        const elevator = new window.google.maps.ElevationService();
        const locations = [{ lat: latitude, lng: longitude }];

        return new Promise((resolve, reject) => {
          elevator.getElevationForLocations({
            locations: locations
          }, (results, status) => {
            if (status === window.google.maps.ElevationStatus.OK && results && results[0]) {
              const elevation = results[0].elevation;
              resolve(elevation);
            } else {
              console.error('Elevation service failed due to:', status);
              reject('Elevation service failed');
            }
          });
        });
      };

      const infoWindow = new InfoWindow();

      const draggableMarker = new AdvancedMarkerElement({
        map,
        position: { lat: 38.66, lng: -97.92 },
        gmpDraggable: true,
        title: "This marker is draggable.",
      });

      draggableMarker.addListener('dragend', (event) => {
        const position = draggableMarker.position as google.maps.LatLng;
        const lat = position.lat;
        const lng = position.lng;
        setLatitude(lat);
        setLongitude(lng);

        infoWindow.close();
        const contentString = `
          <div>
            <header>
              <h1>Stargazing Quality:</h1>
            </header>
            <p>${lat}, ${lng}</p>
            <button id="infoWindowButton">See Stargazing Quality</button>
          </div>
        `;
        infoWindow.setContent(contentString);
        infoWindow.open(draggableMarker.map, draggableMarker);

        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          const button = document.getElementById('infoWindowButton');
          if (button) {
            button.addEventListener('click', () => {
              axios.get('http://127.0.0.1:5000/data', {
                params: {
                  latitude: lat,
                  longitude: lng
                }
              })
                .then(async (response) => {
                  const responseData = response.data;
                  console.log(responseData);
                  const lightScore = Math.max(0, Math.min(100, (30 - responseData.light) * 10 / 3));
                  setLight(responseData.light);
                  const visibilityScore = Math.max(0, Math.min(100, responseData.visibility / 100));
                  const cloudCoverScore = Math.max(0, Math.min(100, 100 - responseData.clouds.all));
                  setCloudCover(responseData.clouds.all);
                  
                  var elevation = await getElevation(lat, lng);
                  const elevationScore = Math.max(0, Math.min(100, elevation/25));
                  setHeight(elevation);
                  const compositeScore = ((0.9*(lightScore * visibilityScore * cloudCoverScore) / (10**6)) + elevationScore/1000).toFixed(2);
                  console.log(lightScore, visibilityScore, cloudCoverScore, elevation);

                  function getCompositeScoreLabel(score) {
                    if (score <= 0.2) {
                      setLabel("Horrible");
                      return { label: "Horrible", color: "red" };
                    } else if (score <= 0.4) {
                      setLabel("Bad");
                      return { label: "Bad", color: "orange" };
                    } else if (score <= 0.6) {
                      setLabel("Mid");
                      return { label: "Mid", color: "yellow" };
                    } else if (score <= 0.8) {
                      setLabel("Good");
                      return { label: "Good", color: "lightgreen" };
                    } else if (score <= 0.95) {
                      setLabel("Great");
                      return { label: "Great", color: "green" };
                    } else {
                      setLabel("Pristine");
                      return { label: "Pristine", color: "darkgreen" };
                    }
                  }
                  // Get the label and color for the composite score
                  const { label, color } = getCompositeScoreLabel(compositeScore);

                  const newContentString = `
                  <div>
                    <h1>Stargazing Quality:</h1>

                    <!-- Composite Score -->
                    <p style="font-size: 24px;">
                      ${compositeScore} - <span style="color: ${color}; font-weight: bold;">${label}</span>
                    </p>


                    <p>${lat}, ${lng}</p>

                    <!-- Light Bar -->
                    <p>Light:</p>
                    <div style="background: linear-gradient(to right, red, green); height: 10px; width: 100%; position: relative;">
                      <!-- Arrow indicator for light -->
                      <div style="position: absolute; left: ${Math.min(98,lightScore)}%; top: -15px;">
                        ▲
                      </div>
                    </div>
                    <p>${responseData.light}</p>

                    <!-- Visibility Bar -->
                    <p>Visibility:</p>
                    <div style="background: linear-gradient(to right, red, green); height: 10px; width: 100%; position: relative;">
                      <!-- Arrow indicator for visibility -->
                      <div style="position: absolute; left: ${Math.min(98,visibilityScore)}%; top: -15px;">
                        ▲
                      </div>
                    </div>
                    <p>${responseData.visibility} meters</p>

                    <!-- Cloud Cover Bar -->
                    <p>Cloud Cover:</p>
                    <div style="background: linear-gradient(to right, red, green); height: 10px; width: 100%; position: relative;">
                      <!-- Arrow indicator for cloud cover -->
                      <div style="position: absolute; left: ${Math.min(98,cloudCoverScore)}%; top: -15px;">
                        ▲
                      </div>
                    </div>
                    <p>${responseData.clouds.all}%</p>

                    <!-- Elevation -->
                    <p>Elevation:</p>
                    <div style="background: linear-gradient(to right, red, green); height: 10px; width: 100%; position: relative;">
                      <!-- Arrow indicator for elevation -->
                      <div style="position: absolute; left: ${Math.min(98, elevationScore)}%; top: -15px;">
                        ▲
                      </div>
                    </div>
                    <p>${elevation} meters</p>

                    <!-- Button -->
                    <button id="infoWindowButton">See Stargazing Quality</button>
                  </div>

                `;
                  infoWindow.setContent(newContentString);
                  infoWindow.open(draggableMarker.map, draggableMarker);
                })
                .catch(error => {
                  console.error('Error fetching data:', error);
                });
            });
          }
        });
      });
    };

    initMap();
  }, []);

  return (
    <div ref={mapRef} style={{ height: '100%', width: '100%' }}>
      {/* The map will be rendered inside this div */}
    </div>
  );
};

// Main App Component with Router
const App = () => {
  const [textBoxContent, setTextBoxContent] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [cloudCover, setCloudCover] = useState('');
  const [light, setLight] = useState('');
  const [label, setLabel] = useState('');
  const [height, setHeight] = useState('');
  console.log("label: " + label);
  const context = "You are a helpful and concise stargazing assistant. All of your responses should be related to stargazing. You are given the following information about the user's location: " + latitude + ", " + longitude + ". You are also given the following information about the cloud cover at the user's location: " + cloudCover + "% cloud cover. Include any outside knowledge about the user's location based on the coordinates. For example, you might suggest nearby locations for stargazing. The light level at the user's location is " + light + ". A high light level is 30 and a low/no light level is 0. The elevation at the user's location is " + height + " meters. The computed label of the stargazing quality at the user's location is: " + label + ". Rely on this label. Also keep in mind that light is the most important factor, followed by cloud cover, and then elevation. Keep your response short and succinct."

  const handleChatSubmit = (e: React.FormEvent) => {
    axios.get('http://127.0.0.1:5000/chat', {
      params: {
        input: context + chatInput
      }
    })
    .then(response => {
      setTextBoxContent(response.data.response);
    })
    .catch(error => {
      console.error('Error sending chat message:', error);
      setTextBoxContent('Error sending chat message');
    });
    e.preventDefault();
    // Here you can add the logic to send the chat input to your backend
    console.log("Chat input submitted:", chatInput);
    // Clear the input after submission
    setChatInput('');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Router>
        <NavBar /> {/* Render the Navbar */}
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<MapPage setLatitude={setLatitude} setLongitude={setLongitude} setCloudCover={setCloudCover} setLight={setLight} setLabel={setLabel} setHeight={setHeight} />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </div>
          <div style={{ width: '300px', padding: '20px', overflowY: 'auto', borderLeft: '1px solid #ccc' }}>
            <h2>Stargazer Chatbot</h2>
            <form onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="How is my location for stargazing?"
                style={{ width: '90%', padding: '10px', marginBottom: '10px' }}
              />
              <button type="submit" style={{ width: '100%', padding: '10px' }}>Send</button>
            </form>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginTop: '20px' }}>
              {textBoxContent}
            </pre>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;

const root = createRoot(document.getElementById('app'));
root.render(<App />);
