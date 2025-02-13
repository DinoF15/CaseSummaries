import { TeamMemberProps } from './TeamMemberProps';


/**
 * Interface representing the properties of a report.
 * 
 * @interface ReportProps
 * 
 * @property {string} id - Unique identifier for the report.
 * @property {string} projectTitle - Title of the project.
 * @property {string} projectType - Type of the project.
 * @property {string} industrialPartner - Name of the  partner.
 * @property {string} startDate - Start date of the project.
 * @property {string} [projectContact] - Contact person for the project.
 * @property {string} [endDate] - End date of the project.
 * @property {string} [duration] - Duration of the project.
 * @property {string} [partnerCash] - Cash contribution from the partner.
 * @property {string} [partnerInKind] - In-kind contribution from the partner.
 * @property {string} [funding] - Funding amount for the project.
 * @property {string} [sourceFunding] - Source of the funding.
 * @property {string} [inlineSummary] - Inline summary of the project.
 * @property {string} [briefSummary] - Brief summary of the project.
 * @property {string} [opportunity] - Opportunity addressed by the project.
 * @property {string} [problem] - Problem addressed by the project.
 * @property {string} [intervention] - Intervention carried out in the project.
 * @property {string} [results] - Results of the project.
 * @property {string} [projectId] - Identifier for the project.
 * @property {string} [goToMarket] - Go-to-market strategy.
 * @property {string} [increaseRevenue] - Information on revenue increase.
 * @property {string} [decreaseCosts] - Information on cost decrease.
 * @property {string} [hireEmployees] - Information on hiring employees.
 * @property {string} [registerNewIntellectualProperty] - Information on new intellectual property registration.
 * @property {string} [export] - Information on export activities.
 * @property {string} [secureInvestment] - Information on securing investment.
 * @property {string} [increaseServices] - Information on increasing services.
 * @property {string} [changeStrategy] - Information on strategy change.
 * @property {string} [improvedProductService] - Information on improved product or service.
 * @property {string} [other] - Other relevant information.
 * @property {string} [newExpertise] - Information on new expertise gained.
 * @property {string} [studentsHired] - Information on students hired.
 * @property {string} [referral] - Referral information.
 * @property {string} [presentResults] - Information on presenting results.
 * @property {string} [mediaCoverage] - Information on media coverage.
 * @property {TeamMember[]} [team] - List of team members involved in the project.
 * @property {string[]} [tags] - Tags associated with the project.
 * @property {string} [internalDetails] - Internal details of the project.
 * @property {string} [partnerType] - Type of the partner.
 * @property {string} [updatedAt] - Timestamp of the last update.
 * @property {string} [updatedBy] - Identifier of the person who last updated the report.
 */
export interface ReportProps {
    id: string;
    projectTitle: string;
    projectType: string;
    industrialPartner: string;
    startDate: string;
    projectContact?: string;
    endDate?: string;
    duration?: string;
    partnerCash?: string;
    partnerInKind?: string;
    funding?: string;
    sourceFunding?: string;
    inlineSummary?: string;
    briefSummary?: string;
    opportunity?: string;
    problem?: string;
    intervention?: string;
    results?: string;
    projectId?: string;
    goToMarket?: string;
    increaseRevenue?: string;
    decreaseCosts?: string;
    hireEmployees?: string;
    registerNewIntellectualProperty?: string;
    export?: string;
    secureInvestment?: string;
    increaseServices?: string;
    changeStrategy?: string;
    improvedProductService?: string;
    other?: string;
    newExpertise?: string;
    studentsHired?: string;
    referral?: string;
    presentResults?: string;
    mediaCoverage?: string;
    team?: TeamMemberProps[];
    tags?: string[];
    internalDetails?: string;
    partnerType?: string;
    updatedAt?: string;
    updatedBy?: string;
  }
