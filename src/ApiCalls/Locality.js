import { useState } from "react";
import axiosRetry from "axios-retry";
import axios from "axios";
import { getItem } from "../auth/localStorage";
import { useEffect } from "react";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export const REACT_APP_API_URL = 'http://localhost:3001';
export const TOKEN_NAME = 'projectToken';


export const useLocality = () => {
    const [token, setToken] = useState("");
  
    useEffect(() => {
      const storedToken = getItem(TOKEN_NAME);
      setToken(storedToken);
    }, []);

    const deleteLocality = async (locality_id) => {
      try {
        const token = await getItem(TOKEN_NAME);
        const response = await axios({
          method: "delete",
          url: `${REACT_APP_API_URL}/locality/${locality_id}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        return response.data;

      } catch(error) {
        console.error("Error get user : ",error);
      }
    };
  
    const getAllLocalitiesPagination = async (pageNb = 1,search = '') => {
     
      try {
        const token =  getItem(TOKEN_NAME);
        const response = await axios({
          method: "get",
          url: `${REACT_APP_API_URL}/locality/all/${pageNb}?search=${encodeURIComponent(search)}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
  
        return response.data;
      } catch (error) {
        console.error("Erreur get Users : ", error);
      }
    };
  
    const addLocality = async ({   
      city,
      country,
      postal_code,
      street_name,
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/locality/`,
        data: {
          city,
          country,
          postal_code,
          street_name,  
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
  
    const updateLocality = async ({
      locality_id,
      city,
      country,
      postal_code,
      street_name,
    }) => {
      return axios({
        method: "patch",
        url: `${REACT_APP_API_URL}/locality/`,
        data: { locality_id, city, country, postal_code, street_name},
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
  
    return {
      getAllLocalitiesPagination,
      addLocality,
      deleteLocality,
      updateLocality,
    };
  };
