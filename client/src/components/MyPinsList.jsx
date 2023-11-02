
// user can edit any of their comments on pins
    // PATCH ?
// user can delete any of their pins
    // DELETE from /pins/${id}
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import MyPinsCard from './MyPinsCard'

const URL = "/api/v1"

export default function MyPinsList() {

    const [pins, setPins] = useState([])
    const {currentUser} = useOutletContext()

    useEffect(() => {
        fetch( URL + '/pins/' + currentUser.id)
            .then((res) => res.json())
            .then((data) => {
                setPins(data);
            })
    // render asking to add 'currentUser.id' as a dependency
    }, [currentUser.id])

    const mapPins = pins.map((pinObj) => (
        <MyPinsCard key={pinObj.id} pinObj={pinObj}/>
      ));

    return (
        <div className="my-pins-list">
            <h2>My Pins</h2>
            <div className="pin-card-list">
                {mapPins}
            </div>
        </div>
    )
}