import React, {useEffect, useState, useRef, useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin
} from '@vis.gl/react-google-maps';

import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';

import {Circle} from './components/circle'

type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
  {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
  {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
  {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
  {key: 'hyderPark',  location: { lat: -33.8690081, lng: 151.2052393 }},
  {key: 'theRocks',   location: { lat: -33.8587568, lng: 151.2058246 }},
  {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
  {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
  {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
  {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
  {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
  {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
  {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
  {key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 }},
  {key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 }},
  {key: 'barangaroo', location: { lat: - 33.8605523, lng: 151.1972205 }},
];

const App = () => {
  const mapRef = useRef(null); // Reference for the map container
  const [textBoxContent, setTextBoxContent] = useState('');
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // Function to initialize the map
    const initMap = async () => {
      // Request needed libraries from Google Maps
      const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Create a new map instance and attach it to the mapRef div
      const map = new Map(mapRef.current, {
        center: { lat: 37.39094933041195, lng: -122.02503913145092 },
        zoom: 5,
        mapId: '4504f8b37365c3d0',
      });

      const infoWindow = new InfoWindow();

      // Create a draggable marker
      const draggableMarker = new AdvancedMarkerElement({
        map,
        position: { lat: 37.39094933041195, lng: -122.02503913145092 },
        gmpDraggable: true,
        title: "This marker is draggable.",
      });

      // Add event listener for when the marker is dropped
      draggableMarker.addListener('dragend', (event) => {
        const position = draggableMarker.position as google.maps.LatLng;
        
        // Close any existing InfoWindow
        infoWindow.close();
      
        // Create the content with a button
        const lat = position.lat;
        const lng = position.lng;
        const contentString = `
          <div>
            <p>Pin dropped at: ${lat}, ${lng}</p>
            <button id="infoWindowButton">Click Me</button>
          </div>
        `;
      
        // Set the content of the InfoWindow
        infoWindow.setContent(contentString);
        infoWindow.open(draggableMarker.map, draggableMarker);
      
        // Wait until the InfoWindow is attached to the DOM and then add a listener to the button
        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          const button = document.getElementById('infoWindowButton');
          if (button) {
            button.addEventListener('click', () => {
              console.log(lat, lng);
              axios.get('http://127.0.0.1:5000/data', {
                params: {
                  latitude: lat,
                  longitude: lng
                }
              })
                .then(response => {
                    // Access the response data
                    const responseData = response.data;
                    console.log(responseData);
                    const lightScore = Math.max(0, Math.min(100, (30 - responseData.light) * 10 / 3));
                    const visibilityScore = Math.max(0, Math.min(100, responseData.visibility / 100));
                    const cloudCoverScore = Math.max(0, Math.min(100, 100 - responseData.clouds.all));
                    console.log(lightScore, visibilityScore, cloudCoverScore);
                    const newContentString = `
                    <div>
                      <p>Pin dropped at: ${lat}, ${lng}</p>

                      <!-- Light Bar -->
                      <p>Light:</p>
                      <div style="background: linear-gradient(to right, red, green); height: 10px; width: 100%; position: relative;">
                        <!-- Arrow indicator for light -->
                        <div style="position: absolute; left: ${lightScore}%; top: -15px;">
                          ▲
                        </div>
                      </div>
                      <p>${responseData.light}</p>

                      <!-- Visibility Bar -->
                      <p>Visibility:</p>
                      <div style="background: linear-gradient(to right, red, green); height: 10px; width: 100%; position: relative;">
                        <!-- Arrow indicator for visibility -->
                        <div style="position: absolute; left: ${visibilityScore}%; top: -15px;">
                          ▲
                        </div>
                      </div>
                      <p>${responseData.visibility} meters</p>

                      <!-- Cloud Cover Bar -->
                      <p>Cloud Cover:</p>
                      <div style="background: linear-gradient(to right, red, green); height: 10px; width: 100%; position: relative;">
                        <!-- Arrow indicator for cloud cover -->
                        <div style="position: absolute; left: ${cloudCoverScore}%; top: -15px;">
                          ▲
                        </div>
                      </div>
                      <p>${responseData.clouds.all}%</p>

                      <!-- Composite Score -->
                      <p>Composite Score: ${lightScore*cloudCoverScore*visibilityScore/(10**6)}</p>

                      <!-- Button -->
                      <button id="infoWindowButton">Click Me</button>
                    </div>

                  `;
                  infoWindow.setContent(newContentString);
                  infoWindow.open(draggableMarker.map, draggableMarker);
                    // Process the response data here
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

    // Call the initMap function after the component mounts
    initMap();
  }, []); // Empty dependency array means this effect runs once after the component mounts

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
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Map container, will be assigned to mapRef */}
      <div ref={mapRef} style={{ height: '100%', width: '70%' }}>
        {/* The map will be rendered inside this div */}
      </div>
      {/* Text box on the right side */}
      <div style={{ width: '30%', padding: '20px', overflowY: 'auto' }}>
        <h2>Stargazer Chatbot</h2>
        <form onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px' }}>Send</button>
        </form>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginTop: '20px' }}>
          {textBoxContent}
        </pre>
      </div>
    </div>
  );
};

export default App;

const root = createRoot(document.getElementById('app'));
root.render(
      <App />
  );

