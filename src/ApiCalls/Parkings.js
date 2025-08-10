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


export const useParking = () => {
    const [token, setToken] = useState("");
    useEffect(() => {
      const storedToken = getItem(TOKEN_NAME);
      setToken(storedToken);
    }, []);
  
    const deleteParking = async (parking_id) => {

      try {

        const token = await getItem(TOKEN_NAME);
        const response = await axios({
          method: "delete",
          url: `${REACT_APP_API_URL}/parking/${parking_id}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        
        });
        return response.data;

      } catch(error) {
        console.error("Error get parking : ",error);
      }
    };
  
    const getAllParkingsPagination = async (pageNb = 1,search = '') => {
     
      try {
        const token = getItem(TOKEN_NAME);
        const response = await axios({
          method: "get",
          url: `${REACT_APP_API_URL}/parking/all/${pageNb}?search=${encodeURIComponent(search)}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
  
        return response.data;
      } catch (error) {
        console.error("Erreur get parkings : ", error);
      }
    };
  
    const updateParking = async ({
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
        data: { parking_id,
          name,
          coordinates,
          places,
          telephone,
          opening,
          place_width,
          fk_locality,},
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
    
    const addParking = async ({
      name,
      coordinates,
      places,
      telephone,
      opening,
      place_width,
      fk_locality,
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/parking/`,
        data: {
          name,
          coordinates,
          places,
          telephone,
          opening,
          place_width,
          fk_locality,  
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };

    const addParkingWithLocality = async ({
      city,
      country,
      postal_code,
      street_name,
             name,
      coordinates,
           places,
        telephone,
          opening,
      place_width 
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/parking/withLocality`,
        data: {
         locality : {
          city,
          country,
          postal_code,
          street_name
         },
         parking : {
                   name,
             coordinates,
                  places,
                telephone,
                 opening,
                 place_width
         }
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
  
    return {
      getAllParkingsPagination,
      addParking,
      deleteParking,
      updateParking,
      addParkingWithLocality
    };
  };