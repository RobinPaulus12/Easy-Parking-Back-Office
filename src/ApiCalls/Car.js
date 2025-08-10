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


export const useCar = () => {
    const [token, setToken] = useState("");
  
    useEffect(() => {
      const storedToken = getItem(TOKEN_NAME);
      setToken(storedToken);
    }, []);
  
    const deleteCar = async (car_id) => {

      try {

        const token = getItem(TOKEN_NAME);
        const response = await axios({
          method: "delete",
          url: `${REACT_APP_API_URL}/car/${car_id}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        return response.data;

      } catch(error) {
        console.error("Error get car : ",error);
      }
    };
  
    const getAllcars = async (pageNb = 1,search = '') => {
     
      try {
        const token = getItem(TOKEN_NAME);
        const response = await axios({
          method: "get",
          url: `${REACT_APP_API_URL}/car/all/${pageNb}?search=${encodeURIComponent(search)}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
  
        return response.data;
      } catch (error) {
        console.error("Erreur get car : ", error);
      }
    };
  
    const addCars= async ({
      license_plate,
      model,
      fk_user,
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/car/`,
        data: {
          license_plate,
          model,
          fk_user,  
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
  
    const updateCar = async ({
      car_id,
      license_plate,
      model,
      fk_user,
    }) => {
      return axios({
        method: "patch",
        url: `${REACT_APP_API_URL}/car/`,
        data: { car_id,
          license_plate,
          model,
          fk_user
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };

    const addCarWithRegistration = async ({
      license_plate,
      model,
       name,
  firstname,
date_of_birth,
    username,
     password,
     isAdmin,     
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/car/withRegistration`,
        data: {
         car : {
          license_plate,
          model,
         },
         user : {
                   name,
              firstname,
          date_of_birth,
               username,
               password,
               isAdmin,
         }
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    };
  
    return {
      getAllcars,
      addCars,
      deleteCar,
      updateCar,
      addCarWithRegistration
    };
  };
