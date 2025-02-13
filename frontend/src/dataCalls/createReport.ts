import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import * as mutations from '../graphql/mutations';
import { ReportInput } from '../types/ReportInput';
import { toast } from 'react-toastify';

/**
 * Creates a new report using the GraphQL mutation.
 *
 * @async
 * @function
 * @param {ReportInput} report - The report input data to create.
 * @returns {Promise<string | null>} The ID of the created report or null if creation fails.
 */
export async function createReport(report: ReportInput): Promise<string | null> {
  try {
    const result = (await API.graphql(
      graphqlOperation(mutations.createReport, { dbItem: report })
    )) as GraphQLResult<{ createReport: { id: string } }>;

    if (result.data && result.data.createReport) {
      return result.data.createReport.id;
    }
  } catch (error) {
    console.error('Error creating report:', JSON.stringify(error, null, 2));
    toast.error("Failed to create report. Check console for details.");
  }
  return null;
}
