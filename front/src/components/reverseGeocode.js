import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

function ReverseGeocode({ lat, lng }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBKdS460pbtW4C0g5FvKZ7gDWQJNT7Oz0s",
  });
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isLoaded && lat != null && lng != null) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          console.error("Geocoding failed:", status);
        }
      });
    }
  }, [isLoaded, lat, lng]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={19}
        center={{ lat: Number(lat), lng: Number(lng) }}
      />
    </div>
  );
}
export default ReverseGeocode;

{
  /* <ReverseGeocode
                          lat={selectedLocation.lat}
                          lng={selectedLocation.lng}
                        /> */
}
