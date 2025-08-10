import { useState, useEffect } from "react";
import axiosRetry from "axios-retry";
import axios from "axios";
import { getItem } from "../auth/localStorage";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export const REACT_APP_API_URL = "http://localhost:3001";
export const TOKEN_NAME = "projectToken";

export const useLocality = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(getItem(TOKEN_NAME));
  }, []);

  const deleteLocality = async (locality_id) => {
    try {
      const token = getItem(TOKEN_NAME);
      const response = await axios({
        method: "delete",
        url: `${REACT_APP_API_URL}/locality/${locality_id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      alert("Error delete locality:", error);
    }
  };

  const getAllLocalitiesPagination = async (pageNb = 1, search = "") => {
    try {
      const token = getItem(TOKEN_NAME);
      const response = await axios({
        method: "get",
        url: `${REACT_APP_API_URL}/locality/all/${pageNb}?search=${encodeURIComponent(search)}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      alert("Error get localities:", error);
    }
  };

  const addLocality = ({ city, country, postal_code, street_name }) => {
    return axios({
      method: "post",
      url: `${REACT_APP_API_URL}/locality/`,
      data: { city, country, postal_code, street_name },
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const updateLocality = ({ locality_id, city, country, postal_code, street_name }) => {
    return axios({
      method: "patch",
      url: `${REACT_APP_API_URL}/locality/`,
      data: { locality_id, city, country, postal_code, street_name },
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return { getAllLocalitiesPagination, addLocality, deleteLocality, updateLocality };
};