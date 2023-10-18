import {useState, useEffect} from 'react'
import mapboxgl from 'mapbox-gl';

const URL = "/api/v1"

export default function MyPinsCard({pinObj, edit=true}) {
    
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

    const [address, setAddress] = useState('')

    async function reverseGeocode(latitude, longitude) {
        try {
            const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`
            )
            if (res.ok) {
                const data = await res.json()
                const firstFeature = data.features[0]
                if (firstFeature) {
                    const formattedAddress = firstFeature.place_name
                    setAddress(formattedAddress)
                }
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error)
        }
    }

    // useEffect to pull the address when the component mounts
    useEffect( () => {
        if (pinObj.longitude && pinObj.latitude) {
            reverseGeocode(pinObj.latitude, pinObj.longitude)
        }
    }, [pinObj.longitude, pinObj.latitude])

    // probably a more react-friendly way to do this, but this makes it so that the div is directly deleted rather than relying on the useEffect in MyPinsList
    function destroyPinAndDeletePinData(id) {
        document.getElementById(`id-${id}`).remove()
        deletePinData(id)
    }

    function deletePinData(id) {
        fetch( URL + '/pins/' + id, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    return (
        <div key={pinObj.id} id={`id-${pinObj.id}`} className="pin-card">
            <img src={pinObj.image} alt={pinObj.plant?.plant_name}/>
            <div className="pin-card-text">
                <h4>{pinObj.plant.plant_name}</h4>
                {/* could try to do reverse geocoding here to get location name/address */}
                <p>{address || `${pinObj.latitude}, ${pinObj.longitude}`}</p>
                <p>{pinObj.comment}</p>
                <p> - {pinObj.user?.username}</p>
                {(edit === true) ? ( <>
                    <button>edit</button>
                    <button onClick={() => destroyPinAndDeletePinData(pinObj.id)}>delete</button>
                    </>) : null
                }
                
            </div>
        </div>
    )
}