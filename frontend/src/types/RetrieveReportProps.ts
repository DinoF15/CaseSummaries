/**
 * Interface representing the properties required to retrieve a report.
 * 
 * @property {string} id - The unique identifier of the report.
 * @property {string} projectTitle - The title of the project associated with the report.
 * @property {string} industrialPartner - The  partner involved in the project.
 * @property {string} sourceFunding - The source of funding for the project.
 * @property {string} updatedBy - The user who last updated the report.
 * @property {string} updatedAt - The timestamp of the last update to the report.
 * @property {string} startDate - The start date of the project.
 */
export interface RetrieveReportProps {
    id: string;
    projectTitle: string;
    industrialPartner: string;
    sourceFunding: string;
    updatedBy: string;
    updatedAt: string;
    startDate: string;
  }