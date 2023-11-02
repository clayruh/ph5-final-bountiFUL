import {useEffect, useState} from 'react'
import {useOutletContext, useNavigate} from 'react-router-dom'

const URL = "/api/v1"

export default function AddPinForm() {

    const navigate = useNavigate()
    const {currentUser} = useOutletContext()

    const [geolocationLoading, setGeolocationLoading] = useState(false)
    const [address, setAddress] = useState('')
    const [minCharTyped, setMinCharTyped] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    
    const [latlng, setLatLng] = useState(null)
    const [optIn, setOptIn] = useState(false)
    const [selectedSuggestion, setSelectedSuggestion] = useState(null)
    
    // USER'S CURRENT GEOLOCATION //
    async function getCurrentPosition() {
        if (navigator.geolocation) {
            setOptIn(true)
            setGeolocationLoading(true)

            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                })
                setGeolocationLoading(false)
                const lng = position.coords.longitude
                const lat = position.coords.latitude
                const latlng = {lat,lng}
                setLatLng(latlng)
                console.log(position)
            } catch (error) {
                setGeolocationLoading(false)
                setOptIn(false)
                alert('Unable to retrieve your location. Either turn on location services or add in an address')
            }
        } else {
        setOptIn(false)
        alert('Sorry your browser does not support geolocation, please add in an address')
        }
    }

    // SEND PHOTO TO PLANT ID API //
    function handleFormSubmit(e) {
        e.preventDefault()

        if (e.target) {
        const formData = new FormData(e.target)
        console.log(e.target)
        console.log([...formData.entries()].forEach(i => console.log(i)))
        // if a user is logged in
        if (currentUser !== null) {
            // if they selected current location
            if (optIn === true) {
            formData.append("lat", latlng.lat)
            formData.append("lng", latlng.lng)
            // if they didn't select current location, add in address
            } else if (optIn === false) {
            formData.append("lat", selectedSuggestion.latitude)
            formData.append("lng", selectedSuggestion.longitude)
            }
            async function upload_image_to_database () {
            await fetch(URL + '/process-image', {
                method: 'POST',
                // DO NOT set headers for passing `multipart/form-data`.
                // For some reason, passing non-JSON-serialized data 
                // using fetch request to Flask backend breaks when 
                // manually specifying headers for fetch. It shouldn't 
                // do that, but it does. So we'll just leave it alone. 
                body: formData,
            })
            .then(res => {
                if (res.ok) {
                res.json().then(newPin => navigate('/map'))
                //  this is where I want to update pin state and add the new one 
                } else {
                console.log(res)
                alert('Error processing image.')
                }
            })
            .catch(error => {
                console.error('Error:', error)
                alert('An error occurred while processing the image')
            })
            }
            upload_image_to_database()
        } else {
            alert("Please log in to add a pin")
        }
        }
    }

    // HANDLE ADDRESS INPUT //
    useEffect( () => {
        if (minCharTyped) {
        const geocode = async () => {
            const limit = 5
            const autocomplete = true
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}&limit=${limit}&autocomplete=${autocomplete}`

            try {
            const response = await fetch(endpoint)
            if (response.ok) {
                const data = await response.json()
                const locations = data.features.map( (feature) => ({
                name: feature.place_name,
                longitude: feature.center[0],
                latitude: feature.center[1]
                }) )
                setSuggestions(locations)
            }
            } catch (error) {
            console.log(error)
            }
        }
        geocode()
        }
        // don't need the address state because we're just going to depend on minCharTyped as the dependency
        // render deployment says I have to add address as a dependency
    }, [minCharTyped, address] )

    function handleSuggestionClick(selectedLocation) {
        // resetting suggestions to empty, and address to the selected location
        setSuggestions([])
        setAddress(selectedLocation.name)
        setSelectedSuggestion(selectedLocation)
        console.log("latitude", selectedLocation.latitude)
        console.log("longitude", selectedLocation.longitude)
      }

    return (
        <div className="form-container">
            <form onSubmit={handleFormSubmit}>
            <h2>Add a Pin</h2>
            <label htmlFor="upload-image">Upload an image<span >*</span></label>
            <input 
                id="upload-image" 
                name="upload-image"
                type="file" 
                accept="image/*, .heic" 
                capture="camera"
                required
            />
            <div className="checkbox-container">
            <input 
                type="checkbox" 
                id="current-position" 
                name="current-position" 
                checked={optIn}
                onChange={getCurrentPosition}></input>
            <label htmlFor="current-position">
                Use my current location
            </label>
            </div>
            
            <label htmlFor="address">Address</label>
            <input 
                id="address" 
                name="address" 
                type="text"
                value={address}
                onChange={(e) => {
                setAddress(e.target.value)
                setMinCharTyped(e.target.value.length >= 7)}}
                disabled={optIn}
                required
                />
            <ul>
                {suggestions.map( (location, index) => (
                <li key={index} onClick={() => handleSuggestionClick(location)}>
                    {location.name}
                </li>
                ) )}
            </ul>
            <label htmlFor="comment">Comment</label>
            <textarea type="text" name="comment" className="comment-input"/>
            {
                (geolocationLoading) ?
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                :
                <input type="submit" value="ADD A PIN"></input>
            }   
        </form>
      </div>
    )
}