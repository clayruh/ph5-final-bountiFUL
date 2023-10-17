export default function MyPinsCard({pinObj}) {
    return (
        <div key={pinObj.id} className="pin-card">
            <img src={pinObj.image} style={{ width: 50 + 'px' }} alt={pinObj.plant.plant_name}/>
            <div className="pin-card-text">
                <h4>{pinObj.plant.plant_name}</h4>
                <p>{pinObj.longitude}, {pinObj.latitude}</p>
                <p>{pinObj.comment}</p>
                <p>- {pinObj.user?.username}</p>
                <button>delete</button>
            </div>
        </div>
    )
}