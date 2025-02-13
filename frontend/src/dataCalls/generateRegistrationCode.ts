// src/dataCalls/generateRegistrationCode.ts
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { toast } from 'react-toastify';

/**
 * Fetches the available registration codes for a given group.
 *
 * @param {string} groupId - The ID of the group for which to fetch the registration codes.
 * @returns {Promise<string[] | null>} A promise that resolves to an array of available registration codes, or null if an error occurs.
 *
 * @throws Will log an error message and show a toast notification if the fetch operation fails.
 */
export async function getAvailableCodes(groupId: string): Promise<string[] | null> {
  try {
    const result = (await API.graphql(
      graphqlOperation(queries.getSignUpCode, { id: groupId })
    )) as GraphQLResult<{ getSignUpCode: { CurrentlyAvailableCodes: string[] } }>;
    if (result.data && result.data.getSignUpCode) {
      return result.data.getSignUpCode.CurrentlyAvailableCodes;
    }
  } catch (error) {
    console.error('Error fetching codes:', error);
    toast.error("Failed to fetch registration codes.");
  }
  return null;
}

/**
 * Updates the registration codes for a given group.
 *
 * @param groupId - The ID of the group for which the registration codes are being updated.
 * @param availableCodes - An array of currently available registration codes.
 * @param assignedCodes - An array of registration codes that have been assigned.
 * @returns A promise that resolves to a boolean indicating whether the update was successful.
 *
 * @throws Will log an error message and show a toast notification if the update fails.
 */
export async function updateRegistrationCodes(
  groupId: string,
  availableCodes: string[],
  assignedCodes: string[]
): Promise<boolean> {
  try {
    const result = (await API.graphql(
      graphqlOperation(mutations.updateSignUpCode, {
        dbItem: { id: groupId, CurrentlyAvailableCodes: availableCodes, AssignedCodes: assignedCodes }
      })
    )) as GraphQLResult<{ updateSignUpCode: { id: string } }>;
    if (result.data && result.data.updateSignUpCode) {
      return true;
    }
  } catch (error) {
    console.error('Error updating registration codes:', error);
    toast.error("Failed to update registration codes.");
  }
  return false;
}
