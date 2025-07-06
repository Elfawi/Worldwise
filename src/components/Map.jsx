import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const navigate = useNavigate();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPostion,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPostion)
      setMapPosition([geolocationPostion.lat, geolocationPostion.lng]);
  }, [geolocationPostion]);
  return (
    <div className={styles.mapContainer}>
      {!geolocationPostion && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "loading.." : "use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker key={city.id} position={city.position}>
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick navigate={navigate} />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  // flyTo()
  map.setView(position, 6, {
    animate: true,
    duration: 1,
    linear: true,
  });
  return null;
}
function DetectClick({ navigate }) {
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}

export default Map;
