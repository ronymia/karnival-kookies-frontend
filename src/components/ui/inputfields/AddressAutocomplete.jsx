import React, { useState, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"]; // Declare this outside of the component

const AddressAutocomplete = () => {
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  // Handle address selection
  const handleSelect = () => {
    const place = autocomplete.getPlace();
    if (place) {
      console.log(place); // You can get details like address, latitude, longitude here
      setAddress(place.formatted_address || ""); // Set the formatted address as the input value
    }
  };

  // Initialize the autocomplete object
  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={handleSelect} // Directly use this callback here
        >
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search for an address"
            style={{ width: "100%", padding: "8px" }}
          />
        </Autocomplete>
      </LoadScript>
    </div>
  );
};

export default AddressAutocomplete;
