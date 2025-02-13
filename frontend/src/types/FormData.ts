import { ImageFileProps } from './ImageFileProps';
import { TeamMemberProps } from './TeamMemberProps';

/**
 * Interface representing the form data for a project.
 * 
 * @property {string} projectTitle - The title of the project.
 * @property {string} industrialPartner - The  partner involved in the project.
 * @property {string} projectContact - The contact person for the project.
 * @property {string} startDate - The start date of the project.
 * @property {string} endDate - The end date of the project.
 * @property {string} duration - The duration of the project.
 * @property {string} partnerCash - The cash contribution from the partner.
 * @property {string} partnerInKind - The in-kind contribution from the partner.
 * @property {string} funding - The total funding for the project.
 * @property {string} sourceFunding - The source of the funding.
 * @property {string} inlineSummary - A brief inline summary of the project.
 * @property {string} briefSummary - A brief summary of the project.
 * @property {string} opportunity - The opportunity the project addresses.
 * @property {string} problem - The problem the project aims to solve.
 * @property {string} intervention - The intervention or approach taken in the project.
 * @property {string} results - The results of the project.
 * @property {string} goToMarket - The go-to-market strategy for the project.
 * @property {string} increaseRevenue - How the project will increase revenue.
 * @property {string} decreaseCosts - How the project will decrease costs.
 * @property {string} hireEmployees - Information about hiring employees for the project.
 * @property {string} registerNewIntellectualProperty - Information about registering new intellectual property.
 * @property {string} export - Information about exporting the project's results.
 * @property {string} secureInvestment - Information about securing investment for the project.
 * @property {string} increaseServices - How the project will increase services.
 * @property {string} changeStrategy - How the project will change strategy.
 * @property {string} improvedProductService - Information about improved products or services.
 * @property {string} other - Any other relevant information.
 * @property {string} newExpertise - New expertise gained from the project.
 * @property {string} studentsHired - Information about students hired for the project.
 * @property {string} referral - Referral information.
 * @property {string} presentResults - Information about presenting the project's results.
 * @property {string} mediaCoverage - Information about media coverage of the project.
 * @property {TeamMember[]} team - The team members involved in the project.
 * @property {string[]} tags - Tags associated with the project.
 * @property {string} currentTag - The current tag for the project.
 * @property {string} projectType - The type of the project.
 * @property {string} internalDetails - Internal details about the project.
 * @property {string} partnerType - The type of partner involved in the project.
 * @property {ImageFile[]} images - Images related to the project.
 * @property {string} updatedAt - The date when the project was last updated.
 * @property {string} otherFundingSource - Other sources of funding for the project.
 */
export interface FormData {
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
    team: TeamMemberProps[];
    tags: string[];
    currentTag: string;
    projectType: string;
    internalDetails: string;
    partnerType: string;
    images: ImageFileProps[];
    updatedAt: string;
    otherFundingSource: string;
  }