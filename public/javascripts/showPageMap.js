maptilersdk.config.apiKey = maptilerApiKey;


const map = new maptilersdk.Map({
    container: 'map',
    // container's id or the HTML element's id to render the map
    style: maptilersdk.MapStyle.STREETS,
    // we can set the map styles
    center: campground.geometry.coordinates,
    // starting position [lng, lat]
    zoom: 12
    // starting zoom
});

// this is used to add a marker/pin to the location we want to set 
new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)