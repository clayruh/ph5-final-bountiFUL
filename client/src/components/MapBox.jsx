import React, {useRef, useEffect, useState} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken=process.env.REACT_APP_MAPBOX_API_KEY

export default function MapBox() {

    const mapContainer = useRef(null)
        const map = useRef(null)

        const [pins, setPins] = useState([])

        // fetch pin data
        useEffect( () => {
            fetch('http://localhost:5555/api/v1/pins')
            .then(res => res.json())
            .then(allData => { 
                setPins(allData)
                
                if (!map.current) {
                    map.current = new mapboxgl.Map({
                        container: mapContainer.current,
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [-73.916369, 40.724461],
                        zoom: 11
                    })
                }

                allData.forEach( (pinObj) => {
                    new mapboxgl.Marker()
                        .setLngLat([pinObj.longitude, pinObj.latitude])
                        .setPopup(new mapboxgl.Popup().setHTML(
                            // '<img src=' + pinObj.plant.image_url + ' />',
                            '<p>' + pinObj.comment + '</p>',
                            '<p>' + pinObj.plant.plant_name + '</p>',
                            ))
                        .addTo(map.current)
                } )
            } )
        }, [])
    
    const mapPins = pins.map( pinObj => (
        <div key={pinObj.id}>
            <h4>{pinObj.plant.plant_name}</h4>
            <p>{pinObj.longitude}</p>
            <p>{pinObj.latitude}</p>
        </div>
        ) )

    return (
        <div>
            <div ref={mapContainer} className="map-container"></div>
            <div>
                {mapPins}
            </div>
        </div>
    )
}