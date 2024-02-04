import { API_BASE_URL, ENDPOINT, CONTENT_TYPE_APPLICATION_JSON, STORAGE_NAME, FM } from "@shared-library/constants";
import { Admin, ClassRecord } from "@shared-library/types";
import axios from "axios";

export const registerAdmin = async (userForm: Admin) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${ENDPOINT.registerAdmin}`,
      userForm,
      { headers: CONTENT_TYPE_APPLICATION_JSON }
    );

    return response.data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const loginAdmin = async (email: string, password: string, rememberMe: boolean) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT.adminLogin}`, {
      method: 'POST',
      headers: CONTENT_TYPE_APPLICATION_JSON,
      body: JSON.stringify({ email, password, rememberMe })
    });

    const data = await response.json()

    if (!response.ok) {
      const errorData: { message: string } = data
      throw new Error(errorData.message)
    }

    if (rememberMe) {
      localStorage.setItem(STORAGE_NAME.token, data.token);
      sessionStorage.removeItem(STORAGE_NAME.token);
    } else {
      sessionStorage.setItem(STORAGE_NAME.token, data.token);
      localStorage.removeItem(STORAGE_NAME.token);
    }

    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const authoriseUser = async () => {
  try {
    const rememberedToken = localStorage.getItem(STORAGE_NAME.token);
    const sessionToken = sessionStorage.getItem(STORAGE_NAME.token);

    const token = sessionToken || rememberedToken;
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(`${API_BASE_URL}${ENDPOINT.authoriseAdmin}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in getAuthorisedUser:", error);
    throw new Error(FM.default);
  }
};

export const setUserSessionData = (data: Omit<Admin, "password">) => {
  sessionStorage.setItem(
    STORAGE_NAME.userSessionData,
    JSON.stringify(data)
  );
}

export const getUserSessionData = (): Admin => {
  return JSON.parse(sessionStorage.getItem(STORAGE_NAME.userSessionData!)!);
};

export const getClassSessionData = (): ClassRecord => {
  return JSON.parse(sessionStorage.getItem(STORAGE_NAME.classSessionData!)!);
}
