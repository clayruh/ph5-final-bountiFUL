export async function getPlants() {
    const plantResponse = await fetch('http://localhost:5555/plants')
    const allPlants = await plantResponse.json()

    return { allPlants }
}