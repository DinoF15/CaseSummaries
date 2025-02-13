import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import * as mutations from '../graphql/mutations';

/**
 * Uploads images for a project using the GraphQL mutation.
 *
 * @async
 * @param {string} projectName - The name/title of the project.
 * @param {string[]} imageNames - An array of image filenames.
 * @param {string[]} imageData - An array of base64-encoded image data.
 * @returns {Promise<string[] | null>} An array of image URLs (or keys) if successful, otherwise null.
 */
export async function createImage(
  projectName: string,
  imageNames: string[],
  imageData: string[]
): Promise<string[] | null> {
  try {
    const result = (await API.graphql(
      graphqlOperation(mutations.createImage, { projectName, imageNames, imageData })
    )) as GraphQLResult<{ createImage: string[] }>;
    if (result.data && result.data.createImage) {
      return result.data.createImage;
    }
  } catch (error) {
    console.error('Error uploading images:', error);
  }
  return null;
}
