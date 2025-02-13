# CaseSummaries Dashboard

[![CI/CD](https://github.com/DinoF15/CaseSummaries/actions/workflows/pipeline.yaml/badge.svg)](https://github.com/DinoF15/CaseSummaries/actions/workflows/pipeline.yaml)

The **CaseSummaries Dashboard** is a full‑stack reporting and analytics application that allows users to create, view, edit, and export detailed project reports. Built with a modern front‑end framework and AWS services, the dashboard provides real‑time updates, advanced filtering, and integration with a custom AI assistant ("Claude") for enhanced insights.

## Features

- **Report Management**
  - Create, update, and delete project reports.
  - Multi‑step forms for comprehensive report details.
  - Export reports to DOCX and PDF formats.
  
- **Advanced Filtering & Search**
  - Filter reports by funding source, year, and partner type.
  - Global search functionality for quick report lookup.

- **AI Assistance**
  - Integrated "Claude" AI model provides context-aware insights and suggestions.

- **Real‑Time Data & Cloud Integration**
  - Uses AWS Amplify, AppSync, and DynamoDB for real‑time data synchronization.
  - Secure authentication via AWS Cognito.

- **Responsive & Modern UI**
  - Fully responsive design that adapts to desktops, tablets, and mobile devices.
  - Clean, intuitive interface with modern styling.

## Technology Stack

- **Front-End:**  
  React, Next.js, React Query, React Table, React Quill
- **Back-End:**  
  AWS Amplify, AppSync, Lambda, DynamoDB
- **CI/CD:**  
  AWS CodePipeline, AWS CDK
- **Styling:**  
  SCSS Modules


## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js (v18.17.0 or later) installed.
- **npm**: Use the latest version of npm to manage dependencies.
- **AWS Credentials**: Configure your AWS credentials and settings in the `aws-exports.js` (or `.ts`) file in the root directory.

### Cloning the Repository

Follow these steps to clone the repository and set up the project on your local machine:

1. **Open your terminal.**

2. **Clone the repository:**

   ```bash
   git clone https://github.com/DinoF15/CaseSummaries.git
   ```

   ``` bash
   cd CaseSummaries

   ```

   ```bash
   npm install

   ```

```bash
   npm run dev
```

