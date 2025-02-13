import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import * as mutations from "../graphql/mutations";
import { UpdateStaffListInput } from "../types/UpdateStaffListInput";
import { toast } from "react-toastify";

/**
 * Updates the staff list using the GraphQL mutation.
 *
 * @async
 * @function updateStaff
 * @param {UpdateStaffListInput} input - The input data to update a staff member.
 * @returns {Promise<any | null>} The updated staff record or null if update fails.
 */
export async function updateStaff(input: UpdateStaffListInput): Promise<any | null> {
  try {
    const result = (await API.graphql(
      graphqlOperation(mutations.updateStaffList, { dbItem: input })
    )) as GraphQLResult<{ updateStaffList: any }>;
    if (result.data && result.data.updateStaffList) {
      return result.data.updateStaffList;
    }
  } catch (error) {
    console.error("Error updating staff:", JSON.stringify(error, null, 2));
    toast.error("Failed to update staff. Check console for details.");
  }
  return null;
}
