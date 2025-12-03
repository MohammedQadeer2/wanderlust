
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // Use the standard style for the map
    center: listing.geometry.coordinates,  // center the map on this longitude and latitude
    zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
});


const marker1 = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h6> ${listing.title} </h6><p>Exact location provided after booking </p>`
        )
    )
    .addTo(map);