"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useIPStackLocation = () => {
  const [locationData, setLocationData] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      setLocationLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/users/location");
        setLocationData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          "An error occurred while fetching location."
        );
        console.error("Fetch from /api/users/location error:", err);
      } finally {
        setLocationLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return {
    locationLoading,
    error,
    locationData,
  };
};

export default useIPStackLocation;
