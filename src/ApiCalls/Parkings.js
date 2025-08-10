import { useState, useEffect } from "react";
import axiosRetry from "axios-retry";
import axios from "axios";
import { getItem } from "../auth/localStorage";
import {toast} from 'react-toastify';

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export const REACT_APP_API_URL = "http://localhost:3001";
export const TOKEN_NAME = "projectToken";

export const useParking = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(getItem(TOKEN_NAME));
  }, []);

  const deleteParking = async (parking_id) => {
    try {
      const token = getItem(TOKEN_NAME);
      const response = await axios({
        method: "delete",
        url: `${REACT_APP_API_URL}/parking/${parking_id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      toast.error("Error delete parking:", error);
    }
  };

  const getAllParkingsPagination = async (pageNb = 1, search = "") => {
    try {
      const token = getItem(TOKEN_NAME);
      const response = await axios({
        method: "get",
        url: `${REACT_APP_API_URL}/parking/all/${pageNb}?search=${encodeURIComponent(search)}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      toast.error("Error get parkings:", error);
    }
  };

  const updateParking = ({
    parking_id,
    name,
    coordinates,
    places,
    telephone,
    opening,
    place_width,
    fk_locality,
  }) => {
    return axios({
      method: "patch",
      url: `${REACT_APP_API_URL}/parking/`,
      data: {
        parking_id,
        name,
        coordinates,
        places,
        telephone,
        opening,
        place_width,
        fk_locality,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const addParking = ({ name, coordinates, places, telephone, opening, place_width, fk_locality }) => {
    return axios({
      method: "post",
      url: `${REACT_APP_API_URL}/parking/`,
      data: { name, coordinates, places, telephone, opening, place_width, fk_locality },
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const addParkingWithLocality = ({
    city,
    country,
    postal_code,
    street_name,
    name,
    coordinates,
    places,
    telephone,
    opening,
    place_width,
  }) => {
    return axios({
      method: "post",
      url: `${REACT_APP_API_URL}/parking/withLocality`,
      data: {
        locality: { city, country, postal_code, street_name },
        parking: { name, coordinates, places, telephone, opening, place_width },
      },
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return {
    getAllParkingsPagination,
    addParking,
    deleteParking,
    updateParking,
    addParkingWithLocality,
  };
};