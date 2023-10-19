import { useEffect, useState } from 'react'

import MyPinsCard from './MyPinsCard'

const URL = "/api/v1"
export default function RecentPins() {

    const [pins, setPins] = useState([])

    useEffect(() => {
        fetch( URL + '/last-pin')
        .then((res) => res.json())
        .then((pin) => {
            setPins(pin);
        })
    }, [])

    const mapPins = pins.map((pinObj) => (
        <MyPinsCard key={pinObj.id} pinObj={pinObj} edit={false}/>
    ))

    return (
        <div className="recent-pins">
            <h2>Most Recent Pins</h2>
            {/* <p>Check out the most recent pins created by our users!</p> */}
            <div className="pin-card-list">
                {mapPins} 
            </div>
        </div>
    )
}