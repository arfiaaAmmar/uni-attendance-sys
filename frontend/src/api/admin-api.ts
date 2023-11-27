import { API_BASE_URL } from "frontend/src/utils/constants";
import { Admin } from "shared-library/src/types.js";

export const registerAdmin = async (userForm: Admin) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userForm),
  });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData: { message: string; } = data;
      throw new Error(errorData.message);
    }

    sessionStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const getAdminData = async () => {
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE_URL}/get-admin-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      const error = data.error || "An error occured";
      throw new Error(error);
    }

    return data;
  } catch (error) {
    throw (error as Error).message
  }
};
