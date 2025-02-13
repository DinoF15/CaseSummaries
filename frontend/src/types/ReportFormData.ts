import { TeamMember } from './TeamMember';

/**
 * Interface representing the data structure for a report form.
 * 
 * @property {string} projectTitle - The title of the project.
 * @property {string} industrialPartner - The  partner involved in the project.
 * @property {string} projectContact - The contact person for the project.
 * @property {string} startDate - The start date of the project.
 * @property {string} endDate - The end date of the project.
 * @property {string} duration - The duration of the project.
 * @property {string} partnerCash - The cash contribution from the partner.
 * @property {string} partnerInKind - The in-kind contribution from the partner.
 * @property {string} funding - The funding amount for the project.
 * @property {string} sourceFunding - The source of the funding.
 * @property {string} inlineSummary - A brief inline summary of the project.
 * @property {string} briefSummary - A brief summary of the project.
 * @property {string} opportunity - The opportunity addressed by the project.
 * @property {string} problem - The problem addressed by the project.
 * @property {string} intervention - The intervention or solution provided by the project.
 * @property {string} results - The results of the project.
 * @property {string} projectId - The unique identifier for the project.
 * @property {string} goToMarket - Information about the go-to-market strategy.
 * @property {string} increaseRevenue - Details on how the project will increase revenue.
 * @property {string} decreaseCosts - Details on how the project will decrease costs.
 * @property {string} hireEmployees - Information on hiring employees as a result of the project.
 * @property {string} registerNewIntellectualProperty - Information on registering new intellectual property.
 * @property {string} export - Information on exporting as a result of the project.
 * @property {string} secureInvestment - Information on securing investment as a result of the project.
 * @property {string} increaseServices - Information on increasing services as a result of the project.
 * @property {string} changeStrategy - Information on changing strategy as a result of the project.
 * @property {string} improvedProductService - Information on improving product or service as a result of the project.
 * @property {string} other - Any other relevant information.
 * @property {string} newExpertise - Information on new expertise gained as a result of the project.
 * @property {string} studentsHired - Information on students hired as a result of the project.
 * @property {string} referral - Referral information.
 * @property {string} presentResults - Information on presenting the results.
 * @property {string} mediaCoverage - Information on media coverage of the project.
 * @property {TeamMember[]} team - The team members involved in the project.
 * @property {string[]} tags - Tags associated with the project.
 * @property {string} currentTag - The current tag associated with the project.
 * @property {string} projectType - The type of the project.
 * @property {string} internalDetails - Internal details about the project.
 * @property {string} partnerType - The type of partner involved in the project.
 * @property {File[]} images - Images associated with the project.
 * @property {string} updatedAt - The date when the project was last updated.
 * @property {string} otherFundingSource - Other sources of funding for the project.
 */
export interface ReportFormData {
    id: string;
    projectTitle: string;
    industrialPartner: string;
    projectContact: string;
    startDate: string;
    endDate: string;
    duration: string;
    partnerCash: string;
    partnerInKind: string;
    funding: string;
    sourceFunding: string;
    inlineSummary: string;
    briefSummary: string;
    opportunity: string;
    problem: string;
    intervention: string;
    results: string;
    projectId: string;
    goToMarket: string;
    increaseRevenue: string;
    decreaseCosts: string;
    hireEmployees: string;
    registerNewIntellectualProperty: string;
    export: string;
    secureInvestment: string;
    increaseServices: string;
    changeStrategy: string;
    improvedProductService: string;
    other: string;
    newExpertise: string;
    studentsHired: string;
    referral: string;
    presentResults: string;
    mediaCoverage: string;
    team: TeamMember[];
    tags: string[];
    currentTag: string;
    projectType: string;
    internalDetails: string;
    partnerType: string;
    images: File[];
    updatedAt: string;
    otherFundingSource: string;
  }