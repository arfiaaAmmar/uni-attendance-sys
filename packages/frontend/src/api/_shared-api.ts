import { HandleDeleteType } from "shared-library/dist/types";
import { API_URL } from "config/config";


export const handleDelete = async (id: string, type: HandleDeleteType) => {
  try {
    const response = await fetch(`${API_URL}/delete-${type}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) console.error(`${type} with ID ${id} deleted successfully.`);
    else console.error(`Failed to delete ${type} with ID ${id}.`);
  } catch (error) {
    console.error(
      `An error occurred while deleting ${type} with ID ${id}.`,
      error
    );
  }
};








