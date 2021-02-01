import locationsArray from '../init-locations.js';

let locationElement = document.getElementById("location");

window.addEventListener('load', main);
locationElement.addEventListener('click', locationHandler);
locationElement.addEventListener('touch', locationHandler);

function main() {
    console.log('Page is fully loaded');
}

let currentlat;
let currentlon;
let error = true;

// getLocation() function is used to retrive the current location
async function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then(position => {
        return position;
    });
}


async function locationHandler() {
    let locText = await getLocation();
    currentlat = locText.coords.latitude;
    document.getElementById("device-lat").innerHTML = "device-latitude: " + currentlat.toFixed(6);
    currentlon = locText.coords.longitude;
    document.getElementById("device-long").innerHTML = "device-longitude: " + currentlon.toFixed(6);

    locationsArray.forEach(function(value) {
        if (isInside(value.Latitude, value.Longitude)) {
            document.getElementById("locationAnswer").innerHTML = value.Name;
            let utterance = new SpeechSynthesisUtterance(`     Welcome to the ${value.Name}`);
            speechSynthesis.speak(utterance);
            error = false;
        }
    });



    if (error) {
        document.getElementById("error-message").innerHTML = "You are not in the range of the location.";
        let utterance = new SpeechSynthesisUtterance("You are not in the range of the location.");
        speechSynthesis.speak(utterance);
    } else {
        document.getElementById("error-message").innerHTML = "";
    }
}







function isInside(questLat, questLon) {
    let distance = distanceBetweenLocations(currentlat, currentlon, questLat, questLon);
    console.log("distance: " + distance);
    console.log("quest lat " + questLat);


    if (distance < 10) {
        return true;
    } else {
        return false;
    }
}


function distanceBetweenLocations(currentlat, currentlon, questLat, questLon) {
    var p = 0.017453292519943295; // Math.PI / 180
    // var c = Math.cos;
    var a = 0.5 - Math.cos((questLat - currentlat) * p) / 2 +
        Math.cos(currentlat * p) * Math.cos(questLat * p) *
        (1 - Math.cos((questLon - currentlon) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}