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

    return (
        <>
            <h2>Most Recent Pin</h2>
            {/* <MyPinsCard key={pins.id} pinObj={pins}/> */}
        </>
    )
}