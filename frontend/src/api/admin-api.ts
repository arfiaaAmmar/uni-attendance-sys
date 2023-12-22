import { API_BASE_URL, API, CONTENT_TYPE_APPLICATION_JSON } from "@shared-library/constants";
import { Admin } from "@shared-library/types";
import axios from "axios";

export const registerAdmin = async (userForm: Admin) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API.registerAdmin}`,
      userForm,
      { headers: CONTENT_TYPE_APPLICATION_JSON }
    );

    return response.data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API.adminLogin}`,
      { email, password },
      { headers: CONTENT_TYPE_APPLICATION_JSON }
    );

    sessionStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const getAdminData = async () => {
  const token = sessionStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API.getAdminData}`,
      config
    );
    return response.data;
  } catch (error) {
    throw (error as Error).message;
  }
};
