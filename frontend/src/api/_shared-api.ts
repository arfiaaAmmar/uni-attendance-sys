import { API_BASE_URL } from "frontend/src/utils/constants";

export { registerStudent, getStudent, getAllStudents } from "./student-api.js";
export { registerAdmin, loginAdmin, getAdminData } from "./admin-api.js";

export const handleDelete = async (
  id: string,
  type: "admin" | "student" | "class-record"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-${type}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) console.log(`${type} with ID ${id} deleted successfully.`);
    else console.error(`Failed to delete ${type} with ID ${id}.`);
  } catch (error) {
    console.error(
      `An error occurred while deleting ${type} with ID ${id}.`,
      error
    );
  }
};
