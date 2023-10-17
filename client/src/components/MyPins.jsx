
// user can edit any of their comments on pins
    // PATCH ?
// user can delete any of their pins
    // DELETE from /pins/${id}
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const URL = "/api/v1"

export default function UserPins() {

    const [pins, setPins] = useState([])
    const {currentUser} = useOutletContext()

    const myPins = useEffect(() => {
        fetch( URL + '/pins/' + currentUser.id)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
    }, [] )

    // const mapPins = myPins.map((pinObj) => (
    //     <div key={pinObj.id}>
    //       <img src={pinObj.image} style={{ width: 50 + 'px' }} alt={pinObj.plant.plant_name}/>
    //       <h4>{pinObj.plant.plant_name}</h4>
    //       <p>{pinObj.longitude}</p>
    //       <p>{pinObj.latitude}</p>
    //       <p>{pinObj.comment}</p>
    //       <p>{pinObj.user?.username}</p>
    //     </div>
    //   ));

    return (
        <>
            <h3>All My Pins</h3>
            {/* {myPins} */}
        </>
    )
}