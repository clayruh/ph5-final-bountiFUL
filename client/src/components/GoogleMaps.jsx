import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

function GoogleMap(props) {

    // console.log(process.env.REACT_APP_GOOGLEMAPS_API_KEY)
    
    // const { allPlants } = useLoaderData()

  return (

    <>
        <Map
        google={props.google}
        zoom={14}
        style={{ width: '100%', height: '400px' }}
        initialCenter={{
            lat: 40.724461,
            lng: -73.916369
        }}
        streetViewControl={false}
        zoomControl={true}
        />
        
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLEMAPS_API_KEY
})(GoogleMap);
