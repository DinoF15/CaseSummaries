// src/dataCalls/updateReport.ts
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import * as mutations from '../graphql/mutations';
import { ReportInput } from '../types/ReportInput';
import { toast } from 'react-toastify';

/**
 * Updates an existing report using the GraphQL mutation.
 *
 * @async
 * @function updateReport
 * @param {ReportInput} report - The report input data to update.
 * @returns {Promise<string | null>} The ID of the updated report or null if update fails.
 */
export async function updateReport(report: ReportInput): Promise<string | null> {
  try {
    const result = (await API.graphql(
      graphqlOperation(mutations.updateReport, { dbItem: report })
    )) as GraphQLResult<{ updateReport: { id: string } }>;
    if (result.data && result.data.updateReport) {
      return result.data.updateReport.id;
    }
  } catch (error) {
    console.error('Error updating report:', JSON.stringify(error, null, 2));
    toast.error("Failed to update report. Check console for details.");
  }
  return null;
}
