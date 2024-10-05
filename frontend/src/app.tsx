import React, {useEffect, useState, useRef, useCallback} from 'react';
import {createRoot} from 'react-dom/client';

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
        const contentString = `
          <div>
            <p>Pin dropped at: ${position.lat}, ${position.lng}</p>
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
              alert('Button clicked!');
            });
          }
        });
      });
    };

    // Call the initMap function after the component mounts
    initMap();
  }, []); // Empty dependency array means this effect runs once after the component mounts

  return (
    // Map container, will be assigned to mapRef
    <div ref={mapRef} style={{ height: '500px', width: '100%' }}>
      {/* The map will be rendered inside this div */}
    </div>
  );
};


export default App;

const root = createRoot(document.getElementById('app'));
root.render(
      <App />
  );

