export default function Popup({pinObj}) {
    return (
        <>
            <img src={pinObj.image} alt={pinObj.plant.plant_name}/>
            <h3>${pinObj.plant.plant_name}</h3>
            <p>${pinObj.comment}</p>
            <p> - ${pinObj.user.username}</p>
        </>
    )
}