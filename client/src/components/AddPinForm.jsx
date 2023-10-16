import {useEffect, useState} from 'react'

export default function AddPinForm({ handleImageUpload, optIn, getCurrentPosition, setSelectedSuggestion}) {

    const [address, setAddress] = useState('')
    const [minCharTyped, setMinCharTyped] = useState(false)
    const [suggestions, setSuggestions] = useState([])

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
    }, [address, minCharTyped] )

    function handleSuggestionClick(selectedLocation) {
        setSelectedSuggestion(selectedLocation)
        console.log("latitude", selectedLocation.latitude)
        console.log("longitude", selectedLocation.longitude)
        setAddress(selectedLocation.name)
        setSuggestions([])
      }

    return (
        <form onSubmit={handleImageUpload}>
          <label htmlFor="upload-image">upload image</label>
          <input 
            id="upload-image" 
            name="upload-image"
            type="file" 
            accept="image/*, .heic" 
            capture="camera"
          />
        <br/>
          <input 
            type="checkbox" 
            id="current-position" 
            name="current-position" 
            checked={optIn}
            onChange={getCurrentPosition} />
          <label htmlFor="current-position">use my current location</label>
        <br/>
          <label htmlFor="address">address</label>
          <input 
            id="address" 
            name="address" 
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              setMinCharTyped(e.target.value.length >= 4)}}
              disabled={optIn}
              />
        <br/>
          <ul>
            {suggestions.map( (location, index) => (
              <li key={index} onClick={() => handleSuggestionClick(location)}>
                {location.name}
              </li>
            ) )}
          </ul>
          <label htmlFor="comment">comment</label>
          <input type="text" name="comment"/>
        <br/>
          <input type="submit" value="add a pin"/>
      </form>
    )
}