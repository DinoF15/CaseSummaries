// src/dataCalls/createStaff.ts
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import * as mutations from "../graphql/mutations";
import { UpdateStaffListInput } from "../types/UpdateStaffListInput";
import { toast } from "react-toastify";

/**
 * Creates a new staff record using the GraphQL mutation.
 *
 * @async
 * @function createStaffList
 * @param {StaffListInput} input - The input data for the new staff member.
 * @returns {Promise<any | null>} The created staff record or null if creation fails.
 */
export async function createStaffList(input: UpdateStaffListInput): Promise<any | null> {
  try {
    const result = (await API.graphql(
      graphqlOperation(mutations.createStaffList, { dbItem: input })
    )) as GraphQLResult<{ createStaffList: any }>;

    if (result.data && result.data.createStaffList) {
      return result.data.createStaffList;
    }
  } catch (error) {
    console.error("Error creating staff:", JSON.stringify(error, null, 2));
    toast.error("Failed to create staff. Check console for details.");
  }
  return null;
}
