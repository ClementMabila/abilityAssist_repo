import React, { useEffect, useState } from "react";
import "../styles/Home.css";

function AbilityAssistPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Function to initialize the map
    const initMap = () => {
      const tutSouthCampusBounds = {
        north: -25.5372,
        south: -25.5444,
        east: 28.0983,
        west: 28.0929
      };
      const tutSouthCampus = { lat: -25.54055, lng: 28.095 };

      const map = new window.google.maps.Map(document.getElementById("map-container"), {
        center: tutSouthCampus,
        zoom: 15,
        restriction: {
          latLngBounds: tutSouthCampusBounds,
          strictBounds: false
        },
        gestureHandling: "cooperative"
      });

      setMap(map);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const userLocation = { lat: latitude, lng: longitude };

            setUserLocation(userLocation);

            const marker = new window.google.maps.Marker({
              position: userLocation,
              map: map,
              title: "Your Location"
            });

            map.setCenter(userLocation);
          },
          (error) => {
            console.error("Error: The Geolocation service failed:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000
          }
        );
      } else {
        console.error("Error: Your browser doesn't support geolocation.");
      }

      const input = document.getElementById("destinationInput");
      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", map);

      setMarkers(map);

      document.getElementById("destinationForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const origin = userLocation;
        const destination = document.getElementById("destinationInput").value;

        if (destination) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: destination, bounds: tutSouthCampusBounds }, function (results, status) {
            if (status === "OK") {
              const destinationLatLng = results[0].geometry.location;
              calculateRoute(origin, destination);
            } else {
              console.error("Geocoding failed due to: " + status);
              document.getElementById("distanceResult").innerHTML = `
                                <p>Failed to find destination. Please try again.</p>
                            `;
            }
          });
        } else {
          document.getElementById("distanceResult").innerHTML = `
                        <p>Please choose a valid destination.</p>
                    `;
        }
      });
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places`;
      script.defer = true;
      script.async = true;
      document.body.appendChild(script);
      script.onload = initMap;
    } else {
      initMap();
    }
  }, []);

  const setMarkers = (map) => {
    const beaches = [
      ["Student town resident admin", -25.54345, 28.09544, 14],
      ["Main gate", -25.54396, 28.09668, 11],
      ["Small gate", -25.54062, 28.09766, 10],
      ["Library", -25.5403, 28.0954, 9],
      ["Building 13", -25.53922, 28.0962, 8],
      ["One stop Post/Under-graduates", -25.54055, 28.09525, 7],
      ["I-Center", -25.5403, 28.09558, 6],
      ["Gymnasium", -25.5413, 28.09568, 4],
      ["Student centre", -25.541454, 28.0951, 3],
      ["Men & Female Resident admin", -25.54025, 28.0949, 2],
      ["Financial Aid office", -25.54055, 28.0957, 1]
    ];

    const image = {
      url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      size: new window.google.maps.Size(20, 32),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(0, 32)
    };

    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly"
    };

    for (let i = 0; i < beaches.length; i++) {
      const beach = beaches[i];

      new window.google.maps.Marker({
        position: { lat: beach[1], lng: beach[2] },
        map,
        icon: image,
        shape: shape,
        title: beach[0],
        zIndex: beach[3]
      });
    }
  };

  const calculateRoute = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode.WALKING
    };

    directionsService.route(request, function (result, status) {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
        const distance = result.routes[0].legs[0].distance.text;
        const duration = result.routes[0].legs[0].duration.text;
        document.getElementById("distanceResult").innerHTML = `
                        <p>Distance: ${distance}</p>
                        <p>Duration: ${duration}</p>
                    `;

        var text = "distance to your selected destination is " + distance + " and the time it will take is " + duration;
        console.log(text);
        if ("speechSynthesis" in window) {
          const speech = new SpeechSynthesisUtterance(text);
          speech.voice = window.speechSynthesis.getVoices()[0];
          speech.volume = 1;
          speech.rate = 1;
          speech.pitch = 1;
          window.speechSynthesis.speak(speech);
        } else {
          console.error("Sorry, your browser does not support text-to-speech.");
        }
      } else {
        console.error("Directions request failed due to: " + status);
        document.getElementById("distanceResult").innerHTML = `
                        <p>Failed to calculate route. Please try again.</p>
                    `;
      }
    });
  };

  const startChat = () => {
    console.log("Chat button clicked.");
    alert("Chat functionality is not yet implemented.");
  };

  const startEmergency = () => {
    console.log("Emergency button clicked.");
    alert("Emergency functionality is not yet implemented.");
  };

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img src="/staticfiles/abilityassist.png" alt="AbilityAssist Logo" height="45" width="50" /> Ability Assist
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">About</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Contact</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Help</a>
                </li>
              </ul>
              <div className="nav-item dropdown ml-auto">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Login to Volunteer Account
                  <i className="fas fa-user"></i>
                  <span className="username"></span>
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">Log In</a>
                  <a className="dropdown-item" href="#">Register</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="container">
        <div className="split-container">
          <div id="map-container"></div>
          <div className="form-container">
            <form id="destinationForm">
              <div className="form-group">
                <label htmlFor="destinationInput">Choose Destination:</label>
                <select className="form-control" id="destinationInput" name="destination">
                  <option value="">Select a destination</option>
                  <option value="5G6CF34W+CM Soshanguve, South Africa">Main Gate</option>
                  <option value="5G6CF35X+Q3 Soshanguve, South Africa">Small Gate</option>
                  <option value="5G6CF35W+V5 Soshanguve,  South Africa">Library</option>
                  <option value="5G6CF36W+8F Soshanguve, South Africa">Building 13</option>
                  <option value="F35W+Q3 Soshanguve, South Africa">One-Stop Building</option>
                  <option value="F35V+VX Soshanguve, South Africa">M&W Res admin</option>
                  <option value="5G6CF35W+Q7 Soshanguve, South Africa">Financial Aid Office</option>
                  <option value="5G6CF35W+V6 Soshanguve, South Africa">I-Center</option>
                  <option value="5G6CF35W+F7 Soshanguve, South Africa">Gymnasium</option>
                  <option value="5G6CF34W+J5 Soshanguve, South Africa">Student town resident admin</option>
                </select>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">Calculate Route</button>
              </div>
            </form>

            <div id="distanceResult"></div>
            <div className="button-container">
              <button className="chat-button" onClick={startChat}>
                <span className="fas fa-comment-dots"></span>
                Chat
              </button>
              <button className="emergency-button" onClick={startEmergency}>
                <span className="fas fa-exclamation-circle"></span>
                Emergency
              </button>
            </div>
          </div>
        </div>

        <div className="company-info">
          <h2>Welcome to AbilityAssist</h2>
          <p>At AbilityAssist, we strive to create a more inclusive world for everyone. Let us know how we can help you or your loved ones today.</p>
        </div>

        <footer>
          <div className="container">
            <p>&copy; 2024 AbilityAssist. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AbilityAssistPage;
