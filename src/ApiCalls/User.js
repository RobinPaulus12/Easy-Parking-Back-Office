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


export const useUser = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
      const storedToken = getItem(TOKEN_NAME);
      setToken(storedToken);
    }, []);

    const getUser = async () => {

      try {
        const token = getItem(TOKEN_NAME);
        const response = await axios({
          method: "get",
          url: `${REACT_APP_API_URL}/user/me`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        return response.data;

      } catch(error) {
        console.log("Error get user : ",error);
      }
    };
  
    const getUsers = async (pageNb = 1,search = '') => {
     
      try {
        const token = getItem(TOKEN_NAME);
        const response = await axios({
          method: "get",
          url: `${REACT_APP_API_URL}/user/all/${pageNb}?search=${encodeURIComponent(search)}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
  
        return response.data;
      } catch (error) {
        console.log("Erreur get Users : ", error);
      }
    };
  
    const addUser = async ({
      name,
      firstname,
      date_of_birth,
      username,
      password,
      isAdmin
    }) => {
      await axios({
        method: "post",
        url: `${REACT_APP_API_URL}/user/registration`,
        data: {
           name,
           firstname,
           date_of_birth,
           username,
           password, 
           isAdmin   
        },
      });
    };

    const updateUserByAdmin = async ({
    user_id,
    name,
    firstname,
    date_of_birth,
    username,
    password,
    isAdmin  
  }) => {
    return await axios({
      method: "patch",
      url: `${REACT_APP_API_URL}/user/admin`,
      data: { user_id,
        name,
        firstname,
        date_of_birth,
        username,
        password,
        isAdmin },
        headers: {
        Authorization: "Bearer " + token,
      },
    });
  };
  const deleteUser = async (user_id) => {
    try {
      const token = getItem(TOKEN_NAME);
      const response = await axios({
        method: "delete",
        url: `${REACT_APP_API_URL}/user/user/${user_id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;

    } catch(error) {
      console.log("Error get user : ",error);
    }
  };
    return {
      getUser,
      addUser,
      getUsers,
      updateUserByAdmin,
      deleteUser
    };
  };