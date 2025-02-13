/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      preferred_username
      registration_code
      group
      __typename
    }
  }
`;
export const listUsersByGroup = /* GraphQL */ `
  query ListUsersByGroup($group: String!) {
    listUsersByGroup(group: $group) {
      id
      username
      email
      preferred_username
      registration_code
      group
      __typename
    }
  }
`;
export const listUser = /* GraphQL */ `
  query ListUser {
    listUser {
      id
      username
      email
      preferred_username
      registration_code
      group
      __typename
    }
  }
`;
export const getSignUpCode = /* GraphQL */ `
  query GetSignUpCode($id: ID!) {
    getSignUpCode(id: $id) {
      id
      SignUpGroup
      CurrentlyAvailableCodes
      AssignedCodes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listSignUpCodes = /* GraphQL */ `
  query ListSignUpCodes {
    listSignUpCodes {
      id
      SignUpGroup
      CurrentlyAvailableCodes
      AssignedCodes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const getReport = /* GraphQL */ `
  query GetReport($id: ID!) {
    getReport(id: $id) {
      id
      projectTitle
      projectType
      industrialPartner
      startDate
      projectContact
      endDate
      duration
      partnerCash
      partnerInKind
      funding
      sourceFunding
      inlineSummary
      briefSummary
      opportunity
      problem
      intervention
      results
      projectId
      goToMarket
      increaseRevenue
      decreaseCosts
      hireEmployees
      registerNewIntellectualProperty
      export
      secureInvestment
      increaseServices
      changeStrategy
      improvedProductService
      other
      newExpertise
      studentsHired
      referral
      presentResults
      mediaCoverage
      team {
        name
        expertise
        __typename
      }
      tags
      internalDetails
      partnerType
      updatedAt
      updatedBy
      __typename
    }
  }
`;
export const listReports = /* GraphQL */ `
  query ListReports {
    listReports {
      id
      projectTitle
      projectType
      industrialPartner
      startDate
      projectContact
      endDate
      duration
      partnerCash
      partnerInKind
      funding
      sourceFunding
      inlineSummary
      briefSummary
      opportunity
      problem
      intervention
      results
      projectId
      goToMarket
      increaseRevenue
      decreaseCosts
      hireEmployees
      registerNewIntellectualProperty
      export
      secureInvestment
      increaseServices
      changeStrategy
      improvedProductService
      other
      newExpertise
      studentsHired
      referral
      presentResults
      mediaCoverage
      team {
        name
        expertise
        __typename
      }
      tags
      internalDetails
      partnerType
      updatedAt
      updatedBy
      __typename
    }
  }
`;
export const listReportsByUser = /* GraphQL */ `
  query ListReportsByUser($username: String!) {
    listReportsByUser(username: $username) {
      id
      projectTitle
      projectType
      industrialPartner
      startDate
      projectContact
      endDate
      duration
      partnerCash
      partnerInKind
      funding
      sourceFunding
      inlineSummary
      briefSummary
      opportunity
      problem
      intervention
      results
      projectId
      goToMarket
      increaseRevenue
      decreaseCosts
      hireEmployees
      registerNewIntellectualProperty
      export
      secureInvestment
      increaseServices
      changeStrategy
      improvedProductService
      other
      newExpertise
      studentsHired
      referral
      presentResults
      mediaCoverage
      team {
        name
        expertise
        __typename
      }
      tags
      internalDetails
      partnerType
      updatedAt
      updatedBy
      __typename
    }
  }
`;
export const getImage = /* GraphQL */ `
  query GetImage($projectName: String!) {
    getImage(projectName: $projectName)
  }
`;
export const getTagList = /* GraphQL */ `
  query GetTagList($id: ID!) {
    getTagList(id: $id) {
      id
      tagName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTagList = /* GraphQL */ `
  query ListTagList {
    listTagList {
      id
      tagName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const getStaffList = /* GraphQL */ `
  query GetStaffList($id: ID!) {
    getStaffList(id: $id) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStaffList = /* GraphQL */ `
  query ListStaffList {
    listStaffList {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
