import { HandleDeleteType } from "shared-library/src/types";
import { API_URL } from "src/config/config";


export const handleDelete = async (id: string, type: HandleDeleteType) => {
  try {
    const response = await fetch(`${API_URL}/delete-${type}/${id}`, {
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








