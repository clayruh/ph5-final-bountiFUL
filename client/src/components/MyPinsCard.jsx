export default function MyPinsCard({pinObj, edit=true}) {

    const URL = "/api/v1"

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
                <p>{pinObj.longitude}, {pinObj.latitude}</p>
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