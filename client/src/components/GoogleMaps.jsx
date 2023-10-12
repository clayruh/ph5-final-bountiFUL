import React, {useEffect, useState} from 'react';
// import { useLoaderData } from 'react-router-dom'
import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';

function GoogleMap(props) {
    // console.log(process.env.REACT_APP_GOOGLEMAPS_API_KEY)

    const [pins, setPins] = useState([])

    useEffect( () => {
    fetch('http://localhost:5555/api/v1/pins')
    .then(res => res.json())
    .then(allData => setPins(allData))
    }, [])

    const mapPins = pins.map( pinObj => (
        // <div key={pinObj.id}>
        //     <h4>{pinObj.plant.plant_name}</h4>
        //     <p>{pinObj.latitude}</p>
        //     <p>{pinObj.longitude}</p>
        // </div>
        <Marker 
        key={pinObj.id}
        // position is an object w properties lat + lng, so don't need {pinObj.latitude} etc
        position={{
            lat: pinObj.latitude,
            lng: pinObj.longitude
        }}
        >
        </Marker>
    ) )

  return (
    <>
        <br></br>
        <h1>pins</h1>
        {mapPins}

        <Map
        google={props.google}
        zoom={10}
        style={{ width: '100%', height: '400px' }}
        initialCenter={{
            lat: 40.724461,
            lng: -73.916369
        }}
        streetViewControl={false}
        zoomControl={true}
        > 
        {mapPins}
        {/* <Marker
        position={{
            lat: 40.7056,
            lng: -74.013413
        }}
        /> */}
        </Map>
        

    </>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLEMAPS_API_KEY
})(GoogleMap);
