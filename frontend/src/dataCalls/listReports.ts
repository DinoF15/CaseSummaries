import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import * as queries from '../graphql/queries';
import { ReportProps } from '../types/ReportProps';

/**
 * Fetches a list of reports from the API using a type-safe GraphQL query.
 *
 * @async
 * @function
 * @returns {Promise<Report[]>} A promise that resolves to the list of reports or an empty array on failure.
 */
export async function listReports(): Promise<Report[]> {
  try {
    const result = (await API.graphql(
      graphqlOperation(queries.listReports)
    )) as GraphQLResult<{ listReports: Report[] }>;

    if (result.data && result.data.listReports) {
      return result.data.listReports;
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
  }
  return [];
}
