import React, { useState, useEffect } from "react";
import api from "../api";
import Route from "../components/Route"
import "../styles/Home.css";

function Home() {
    const [routes, setRoutes] = useState([]);
    const [location, setLocation] = useState("");
    const [destination, setDestination] = useState("");

    useEffect(() => {
        getRoutes();
    }, []);

    const getRoutes = () => {
        api
            .get("/api/routes/") // Assuming this endpoint returns a list of routes
            .then((res) => res.data)
            .then((data) => {
                setRoutes(data);
            })
            .catch((err) => console.error(err)); // Use console.error for errors
    };

    const deleteRoute = (id) => {
        api
            .delete(`/api/routes/${id}/`) // Assuming this endpoint deletes a route by ID
            .then((res) => {
                if (res.status === 204) {
                    alert("Route deleted!");
                    getRoutes(); // Refresh the list of routes after deletion
                } else {
                    alert("Failed to delete route.");
                }
            })
            .catch((error) => console.error(error));
    };

    const createRoute = (e) => {
        e.preventDefault();
        api
            .post("/api/routes/", { location, destination })
            .then((res) => {
                if (res.status === 201) {
                    alert("Route created!");
                    getRoutes(); // Refresh the list of routes after creation
                } else {
                    alert("Failed to create route.");
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <div>
                <h2>Routes</h2>
                {routes.map((route) => (
                    <div key={route.id}>
                        <p>{route.location} to {route.destination}</p>
                        <button onClick={() => deleteRoute(route.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <div>
                <h2>Create a Route</h2>
                <form onSubmit={createRoute}>
                    <label htmlFor="location">Location:</label>
                    <br />
                    <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <br />
                    <label htmlFor="destination">Destination:</label>
                    <br />
                    <textarea
                        id="destination"
                        name="destination"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    ></textarea>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}

export default Home;
