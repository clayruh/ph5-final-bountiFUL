import { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
// import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import RecentPins from './RecentPins'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const URL = "/api/v1"

export default function MapBox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [pins, setPins] = useState([])

  // HANDLE BOOKMARKS //
  // function handleBookmark() {
  //   console.log("bookmarked!")
  // }

  useEffect(() => {
    fetch( URL + '/pins')
      .then((res) => res.json())
      .then((allData) => {
        setPins(allData);

        if (!map.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-73.916369, 40.724461],
            zoom: 11,
          });
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
          map.current.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true
          }), 'top-right');
          // // instantiate MapboxDirections
          // const directions = new MapboxDirections({
          //   accessToken: mapboxgl.accessToken,
          // })
          // map.current.addControl(directions, 'top-left');
        }

        pins.forEach((pinObj) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([pinObj.longitude, pinObj.latitude])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `
                <div className="mapbox-popup">
                  <div className="mapbox-popup-img">
                    <img src="${pinObj.image}" alt=${pinObj.plant.plant_name}/>
                  </div>
                  <div className="mapbox-popup-text">
                    <h3>${pinObj.plant.plant_name}</h3>
                    <p>${pinObj.comment}</p>
                    <p> - ${pinObj.user?.username}</p>
                  </div>
                  <div className="bookmark-button">
                  </div>
                </div>
                `
              )
            )
            .addTo(map.current);

          // event listener to the marker
          marker.getElement().addEventListener('click', () => {
            setSelectedPin(pinObj);
          });
        });
      });
  }, []);

  // Zoom to the selected pin
  useEffect(() => {
    if (selectedPin) {
      map.current.flyTo({
        center: [selectedPin.longitude, selectedPin.latitude],
        // zoom: 9,
        duration: 500,
      });
    }
  }, [selectedPin]);

  // // just mapping to the page to see details
  // const mapPins = pins.map((pinObj) => (
  //   <div key={pinObj.id}>
  //     <img src={pinObj.image} style={{ width: 50 + 'px' }} alt={pinObj.plant.plant_name}/>
  //     <h4>{pinObj.plant.plant_name}</h4>
  //     <p>{pinObj.longitude}</p>
  //     <p>{pinObj.latitude}</p>
  //     <p>{pinObj.comment}</p>
  //     <p>{pinObj.user?.username}</p>
  //   </div>
  // ));

  return (
    <div>
      <div ref={mapContainer} className="map-container"></div>
      <RecentPins />
    </div>
  );
}
