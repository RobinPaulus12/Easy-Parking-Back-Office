import { useState } from "react";
import axiosRetry from "axios-retry";
import axios from "axios";
//import { REACT_APP_API_URL, TOKEN_NAME } from "@env";
import { getItem } from "../auth/localStorage";
import { useEffect } from "react";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export const REACT_APP_API_URL = 'http://localhost:3001';
export const TOKEN_NAME = 'projectToken';


export const usePlace = () => {
    const [token, setToken] = useState("");
  
    useEffect(() => {
      const storedToken = getItem(TOKEN_NAME);
      setToken(storedToken);
    }, []);
  
    const deletePlace = async (place_id) => {

      try {

        const token = getItem(TOKEN_NAME);
        const response = await axios({
          method: "delete",
          url: `${REACT_APP_API_URL}/place/${place_id}`,
          headers: {
            Authorization: "Bearer " + token,
          },
          data:{
            place_id,
          }
        });
        return response.data;

      } catch(error) {
        console.log("Error get place: ",error);
      }
    };
  
    const getAllPlacesPagination = async (pageNb = 1,search = '') => {
     
      try {
        const token = getItem(TOKEN_NAME);
        const response = await axios({
          method: "get",
          url: `${REACT_APP_API_URL}/place/all/${pageNb}?search=${encodeURIComponent(search)}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
  
        return response.data;
      } catch (error) {
        console.log("Erreur get place : ", error);
      }
    };
  
    const addPlace = async ({
      arrival_time,
      departure_time,
      fk_parking,
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/place/`,
        data: {
          arrival_time,
          departure_time,
          fk_parking, 
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
  
    const updatePlace = async ({
      place_id,
      arrival_time,
      departure_time,
      fk_parking,
    }) => {
      return await axios({
        method: "patch",
        url: `${REACT_APP_API_URL}/place/`,
        data: { place_id,
          arrival_time,
          departure_time,
          fk_parking
        },
          headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
    const getPlacesforParking = async (parking_id) => {

      try {
        const token = await getItem(TOKEN_NAME);
        const response = await axios({
          method: "get",
          url: `${REACT_APP_API_URL}/places/${parking_id}`,
          headers: {
            Authorization: "Bearer " + token,
          }, 
        });
        return response.data;

      } catch(error) {
        console.log("Error get parking : ",error);
      }
    }; 

    const addPlaceWithParking = async ({
      arrival_time,
      departure_time,
      name,
      coordinates,
      places,
      telephone,
      opening,
      place_width,
      fk_locality  
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/place/withParking`,
        data: {
         place : {
          arrival_time,
          departure_time,
         },
         parking : {
          name,
          coordinates,
          places,
          telephone,
          opening,
          place_width,
          fk_locality 
         }
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
   
    return {
      addPlace,
      deletePlace,
      updatePlace,
      getPlacesforParking,
      addPlaceWithParking,
      getAllPlacesPagination
    };
  };