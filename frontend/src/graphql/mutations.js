/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($dbItem: UserInput!) {
    createUser(dbItem: $dbItem) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($dbItem: UpdateUserInput!) {
    updateUser(dbItem: $dbItem) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
export const createSignUpCode = /* GraphQL */ `
  mutation CreateSignUpCode($dbItem: SignUpCodeInput!) {
    createSignUpCode(dbItem: $dbItem) {
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
export const updateSignUpCode = /* GraphQL */ `
  mutation UpdateSignUpCode($dbItem: UpdateSignUpCodeInput!) {
    updateSignUpCode(dbItem: $dbItem) {
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
export const deleteSignUpCode = /* GraphQL */ `
  mutation DeleteSignUpCode($id: ID!) {
    deleteSignUpCode(id: $id)
  }
`;
export const createReport = /* GraphQL */ `
  mutation CreateReport($dbItem: ReportInput!) {
    createReport(dbItem: $dbItem) {
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
export const updateReport = /* GraphQL */ `
  mutation UpdateReport($dbItem: ReportInput!) {
    updateReport(dbItem: $dbItem) {
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
export const deleteReport = /* GraphQL */ `
  mutation DeleteReport($id: ID!) {
    deleteReport(id: $id)
  }
`;
export const getPresignedUrl = /* GraphQL */ `
  mutation GetPresignedUrl($key: [String!]!) {
    getPresignedUrl(key: $key) {
      url
      key
      __typename
    }
  }
`;
export const createImage = /* GraphQL */ `
  mutation CreateImage(
    $projectName: String!
    $imageData: [String!]!
    $imageNames: [String!]!
  ) {
    createImage(
      projectName: $projectName
      imageData: $imageData
      imageNames: $imageNames
    )
  }
`;
export const removeImage = /* GraphQL */ `
  mutation RemoveImage($projectName: String!, $imageName: String!) {
    removeImage(projectName: $projectName, imageName: $imageName)
  }
`;
export const createTagList = /* GraphQL */ `
  mutation CreateTagList($dbItem: TagListInput!) {
    createTagList(dbItem: $dbItem) {
      id
      tagName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTagList = /* GraphQL */ `
  mutation UpdateTagList($dbItem: UpdateTagListInput!) {
    updateTagList(dbItem: $dbItem) {
      id
      tagName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTagList = /* GraphQL */ `
  mutation DeleteTagList($id: ID!) {
    deleteTagList(id: $id)
  }
`;
export const createStaffList = /* GraphQL */ `
  mutation CreateStaffList($dbItem: StaffListInput!) {
    createStaffList(dbItem: $dbItem) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateStaffList = /* GraphQL */ `
  mutation UpdateStaffList($dbItem: UpdateStaffListInput!) {
    updateStaffList(dbItem: $dbItem) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteStaffList = /* GraphQL */ `
  mutation DeleteStaffList($id: ID!) {
    deleteStaffList(id: $id)
  }
`;
export const invokeClaudeAnalysis = /* GraphQL */ `
  mutation InvokeClaudeAnalysis($userQuery: String!) {
    invokeClaudeAnalysis(userQuery: $userQuery) {
      userQuery
      bedrock_context
      data_context
      error
      __typename
    }
  }
`;
