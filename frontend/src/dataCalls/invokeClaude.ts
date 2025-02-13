// src/dataCalls/invokeClaude.ts
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import * as mutations from '../graphql/mutations';
import { toast } from 'react-toastify';

import { ClaudeResponse } from '../types/ClaudeResponse';


/**
 * Invokes Claude Analysis using the GraphQL mutation.
 *
 * @async
 * @function invokeClaude
 * @param {string} userQuery - The query string input by the user.
 * @returns {Promise<ClaudeResponse | null>} The response from Claude or null if failed.
 */
export async function invokeClaude(userQuery: string): Promise<ClaudeResponse | null> {
  try {
    const result = (await API.graphql(
      graphqlOperation(mutations.invokeClaudeAnalysis, { userQuery })
    )) as GraphQLResult<{ invokeClaudeAnalysis: ClaudeResponse }>;

    if (result.data && result.data.invokeClaudeAnalysis) {
      return result.data.invokeClaudeAnalysis;
    }
  } catch (error) {
    console.error('Error invoking Claude Analysis:', JSON.stringify(error, null, 2));
    toast.error("Failed to invoke Claude. Check console for details.");
  }
  return null;
}
