import React, { useEffect, useRef } from 'react';
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
const MapPage = () => {
  const mapRef = useRef(null); // Reference for the map container
  const [textBoxContent, setTextBoxContent] = useState('');
  const [chatInput, setChatInput] = useState('');

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
                .then(response => {
                  const responseData = response.data;
                  console.log(responseData);
                  const lightScore = Math.max(0, Math.min(100, (30 - responseData.light) * 10 / 3));
                  const visibilityScore = Math.max(0, Math.min(100, responseData.visibility / 100));
                  const cloudCoverScore = Math.max(0, Math.min(100, 100 - responseData.clouds.all));
                  const compositeScore = ((lightScore*visibilityScore*cloudCoverScore)/(10**6)).toFixed(2);
                  console.log(lightScore, visibilityScore, cloudCoverScore);

                  function getCompositeScoreLabel(score) {
                    if (score <= 0.2) {
                      return { label: "Horrible", color: "red" };
                    } else if (score <= 0.4) {
                      return { label: "Bad", color: "orange" };
                    } else if (score <= 0.6) {
                      return { label: "Mid", color: "yellow" };
                    } else if (score <= 0.8) {
                      return { label: "Good", color: "lightgreen" };
                    } else if (score <= 0.95) {
                      return { label: "Great", color: "green" };
                    } else {
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

                    <!-- Button -->
                    <button id="infoWindowButton">See Stargazing Quality</button>
                  </div>

                `;
                  infoWindow.setContent(newContentString);
                  infoWindow.open(draggableMarker.map, draggableMarker);
                })
                .catch(error => {
                  console.error('Error fetching data:', error);
                  setTextBoxContent('Error fetching data');
                });
            });
          }
        });
      });
    };

    initMap();
  }, []);

  const handleChatSubmit = (e: React.FormEvent) => {
    axios.get('http://127.0.0.1:5000/chat', {
      params: {
        input: chatInput
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
    <div ref={mapRef} style={{ height: '100%', width: '100%' }}>
      {/* The map will be rendered inside this div */}
    </div>
  );
};


export default App;

const root = createRoot(document.getElementById('app'));
root.render(<App />);
