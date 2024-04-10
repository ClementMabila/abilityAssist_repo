import React from "react";
import "../styles/Route.css";

function Route({ route, onDelete }) {
    const formattedDate = new Date(route.created_at).toLocaleDateString("en-US");

    return (
        <div className="route-container">
            <p className="route-location">{route.location}</p>
            <p className="route-destination">{route.destination}</p>
            <p className="route-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(route.id)}>
                Delete
            </button>
        </div>
    );
}

export default Route;
