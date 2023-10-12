import React, {useRef, useEffect, useState} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken=process.env.REACT_APP_MAPBOX_API_KEY

export default function MapBox() {

    const mapContainer = useRef(null)
        const map = useRef(null)
        const [lng, setLng] = useState(-73.916369)
        const [lat, setLat] = useState(40.724461)
        const [zoom, setZoom] = useState(11)

        useEffect( () => {
            if (map.current) return;
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            })
        },[] )

    return (
        <div>
            <div ref={mapContainer} className="map-container"></div>
        </div>
    )
}