import React from "react";
import "./PopUp.css";

const PopUp = ({ mangas, status, onClose }) => {
  if (!mangas) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>{status}</h2>
        <ul>
          {mangas.map((manga) => (
            <li key={manga.id}>{manga.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PopUp;
