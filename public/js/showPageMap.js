mapboxgl.accessToken = token
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center,
    zoom: 8
})

map.addControl(new mapboxgl.NavigationControl())

new mapboxgl.Marker()
    .setLngLat(center)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${place.title}</h3>
            <p>${place.location}</p>`
        )
    )
    .addTo(map)
