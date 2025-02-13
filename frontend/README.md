# Reporting Dashboard

The **Reporting Dashboard** is a web-based application that allows users to retrieve, update, and manage detailed reports. Built with **React**, **Next.js**, **AWS Amplify**, and **GraphQL**, this dashboard provides advanced filtering, search, and export functionality (DOCX, PDF) for efficient report management.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Pages & Components](#pages--components)
- [AWS & GraphQL Integration](#aws--graphql-integration)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [License](#license)
- [Contributing](#contributing)

---

## Overview

The Reporting Dashboard streamlines the process of retrieving and managing reports. Users can search, filter by funding source, year, or partner type, and view detailed report information. The dashboard also supports report export to DOCX and PDF formats and provides an intuitive interface for editing and deleting reports.

---

## Features

- **Advanced Filtering & Search:**  
  Filter reports based on funding source, year, partner type, and global search input.

- **Report Management:**  
  View, edit, and delete reports with confirmation modals.

- **Export Functionality:**  
  Export report details to DOCX and print to PDF with custom styles.

- **Pagination:**  
  Paginated table view with 8 entries per page for improved readability.

- **Real-time Data Updates:**  
  Leverage AWS AppSync and Amplify to fetch and update report data dynamically.

---

## Pages & Components

### Pages

- **Retrieve Reports:**  
  - `src/pages/index.tsx` – Main page for retrieving and filtering reports.
- **Report Details:**  
  - `src/pages/report/[id].tsx` – Detailed view for a single report with edit and export options.
- **Admin Settings:**  
  - `src/pages/Admin.tsx` – Admin page for managing sign-up codes and other settings.

### Components

- **EditReportModal:**  
  A multi-step modal form for editing report details.
- **ConfirmDeleteToast:**  
  A toast notification to confirm report deletion.
- **SignUpCodeForm:**  
  A form component for generating registration codes.
- **Pagination Controls:**  
  Integrated within the reports table for navigation.

---

## AWS & GraphQL Integration

The project uses **AWS Amplify** to configure authentication and connect to a GraphQL API provided by **AWS AppSync**. The GraphQL schema defines types for `Report`, `TeamMember`, and other entities. Data calls (e.g., `listReports`, `updateReport`) are used to interact with the backend.

Key integrations:

- **AWS Amplify:** For authentication and API configuration.
- **AWS AppSync:** For GraphQL queries and mutations.
- **Amazon DynamoDB:** As the primary data store.

For more details, refer to the [AWS Amplify Documentation](https://docs.amplify.aws/).

---

## Installation

Clone the repository and install the dependencies using npm:

```bash
git clone <your-repo-url>
cd reporting-dashboard
npm install


## Environment Variables

You will need to set up environment variables for the project to run correctly. Create a `.env.local` file in the root directory and add the following variables:

```bash
NEXT_PUBLIC_API_URL=<your-api-url>
NEXT_PUBLIC_REGION=<your-region>
NEXT_PUBLIC_AUTH_REGION=<your-auth-region>
NEXT_PUBLIC_USER_POOL_ID=<your-user-pool-id>
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=<your-web-client-id>
NEXT_PUBLIC_IDENTITY_POOL_ID=<your-identity-pool-id>
```