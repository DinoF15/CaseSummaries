/**
 * Interface representing the input data for a report.
 * 
 * @property {string} projectTitle - The title of the project.
 * @property {string} projectType - The type of the project.
 * @property {string} industrialPartner - The  partner involved in the project.
 * @property {string} startDate - The start date of the project.
 * @property {string} [endDate] - The end date of the project (optional).
 * @property {string} [duration] - The duration of the project (optional).
 * @property {string} [partnerCash] - The cash contribution from the partner (optional).
 * @property {string} [partnerInKind] - The in-kind contribution from the partner (optional).
 * @property {string} [funding] - The funding amount for the project (optional).
 * @property {string} sourceFunding - The source of the funding for the project.
 * @property {string} [inlineSummary] - An inline summary of the project (optional).
 * @property {string} [briefSummary] - A brief summary of the project (optional).
 * @property {string} [intervention] - The intervention details of the project (optional).
 * @property {string} [results] - The results of the project (optional).
 * @property {string[]} [tags] - A list of tags associated with the project (optional).
 * @property {File[]} [images] - A list of image files related to the project (optional).
 */
export interface ReportInput {
    projectTitle: string;
    projectType: string;
    industrialPartner: string;
    startDate: string;
    endDate?: string;
    duration?: string;
    partnerCash?: string;
    partnerInKind?: string;
    funding?: string;
    sourceFunding: string;
    inlineSummary?: string;
    briefSummary?: string;
    intervention?: string;
    results?: string;
    tags?: string[];
    images?: File[];
  }
  