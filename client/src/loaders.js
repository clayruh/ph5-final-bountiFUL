export async function getPins() {
    const pinResponse = await fetch('http://localhost:5555/api/v1/pins')
    const allPins = await pinResponse.json()
    
    return { allPins }
}