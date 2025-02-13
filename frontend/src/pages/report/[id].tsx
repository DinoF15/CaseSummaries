// src/pages/report/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { API, graphqlOperation } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord, faFilePdf, faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import EditReportModal from '../../components/EditReportModal';
import { toast } from 'react-toastify';
import * as queries from '../../graphql/queries';
import styles from '../../styles/ReportDetails.module.scss';

/* -------------------- UTILITIES -------------------- */

// Utility to strip HTML tags from a string
const stripHTMLTags = (input: string): string => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.body.textContent || '';
};

// Utility to format keys (camelCase to Title Case) and append a question mark
const formatKey = (key: string): string =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim() + '?';

/* -------------------- DOCX EXPORT HELPERS -------------------- */

// Create a heading paragraph (for DOCX export)
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  TextRun,
  AlignmentType,
} from 'docx';

const createHeading = (text: string, level: HeadingLevel = HeadingLevel.HEADING_1) =>
  new Paragraph({
    heading: level,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text,
        font: "Arial",
        size: level === HeadingLevel.HEADING_1 ? 28 : 24, // 14pt for Heading1, 12pt for Heading2
        color: "2E2E2E",
      }),
    ],
  });

// Create a section divider
const createSectionDivider = () =>
  new Paragraph({
    children: [
      new TextRun({
        text: "⎯".repeat(50),
        color: "DDDDDD",
      }),
    ],
    spacing: { before: 400, after: 400 },
    alignment: AlignmentType.CENTER,
  });

// Create a styled table from an array of { key, value } objects
const createStyledTable = (rows: { key: string; value: string }[]) =>
  new Table({
    width: { size: 9000, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    rows: rows.map((row) => createTableRow(row.key, row.value)),
  });

// Create a table row with two cells using a smaller font size (size 20 = 10pt)
const createTableRow = (key: string, value: string, hasShading = true) =>
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: key,
                bold: true,
                size: 20,
                font: "Arial",
              }),
            ],
            spacing: { before: 120, after: 120 },
          }),
        ],
        width: { size: 3000, type: WidthType.DXA },
        shading: hasShading ? { fill: "F2F2F2" } : undefined,
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
        },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                size: 20,
                font: "Arial",
              }),
            ],
            spacing: { before: 120, after: 120 },
          }),
        ],
        width: { size: 6000, type: WidthType.DXA },
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
        },
      }),
    ],
    tableHeader: false,
  });

/* Impact Section Helpers */
const getOrganizationImpact = (report: any) => {
  const impactFields = {
    'Go To Market': 'goToMarket',
    'Increase Revenue': 'increaseRevenue',
    'Decrease Costs': 'decreaseCosts',
    'Hire Employees': 'hireEmployees',
    'Register New IP': 'registerNewIntellectualProperty',
    'Export': 'export',
    'Secure Investment': 'secureInvestment',
    'Increase Services': 'increaseServices',
    'Change Strategy': 'changeStrategy',
    'Improved Product/Service': 'improvedProductService',
    'Other': 'other',
  };
  return Object.entries(impactFields)
    .filter(([_, field]) => report[field])
    .map(([key, field]) => ({
      key,
      value: stripHTMLTags(report[field] || ''),
    }));
};

const getMohawkImpact = (report: any) => {
  const impactFields = {
    'New Expertise': 'newExpertise',
    'Students Hired': 'studentsHired',
    'Referral': 'referral',
    'Present Results': 'presentResults',
    'Media Coverage': 'mediaCoverage',
  };
  return Object.entries(impactFields)
    .filter(([_, field]) => report[field])
    .map(([key, field]) => ({
      key,
      value: stripHTMLTags(report[field] || ''),
    }));
};

const hasOrganizationImpact = (report: any) =>
  getOrganizationImpact(report).some((row) => row.value);
const hasMohawkImpact = (report: any) =>
  getMohawkImpact(report).some((row) => row.value);

/* DOCX EXPORT FUNCTION (Internal Details omitted) */
const exportToDocx = async (report: any) => {
  if (!report) {
    toast.error('No report available to export.');
    return;
  }
  try {
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            quickFormat: true,
            run: {
              font: "Arial",
              size: 20, // 10pt
              color: "333333",
            },
            paragraph: {
              spacing: { line: 360, before: 200, after: 200 },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: [
            createHeading('Project Report'),
            createHeading(report.projectTitle, HeadingLevel.HEADING_2),
            createSectionDivider(),
            createHeading('Overview', HeadingLevel.HEADING_2),
            createStyledTable([
              { key: ' Partner', value: report.industrialPartner },
              { key: 'Partner Type', value: report.partnerType },
              { key: 'Project Duration', value: `${report.startDate} to ${report.endDate} (${report.duration})` },
              { key: 'Funding Source', value: report.sourceFunding },
              { key: 'Total Cost', value: report.totalCost },
            ]),
            createSectionDivider(),
            createHeading('Summary & Details', HeadingLevel.HEADING_2),
            new Paragraph({
              text: stripHTMLTags(report.inlineSummary),
              spacing: { before: 200, after: 200 },
            }),
            createStyledTable([
              { key: 'Opportunity', value: stripHTMLTags(report.opportunity) },
              { key: 'Problem', value: stripHTMLTags(report.problem) },
              { key: 'Intervention', value: stripHTMLTags(report.intervention) },
              { key: 'Results', value: stripHTMLTags(report.results) },
            ]),
            createSectionDivider(),
            createHeading('Impact - Organization', HeadingLevel.HEADING_2),
            createStyledTable(
              Object.entries({
                'Go To Market': report.goToMarket,
                'Increase Revenue': report.increaseRevenue,
                'Decrease Costs': report.decreaseCosts,
                'Hire Employees': report.hireEmployees,
                'Register New IP': report.registerNewIntellectualProperty,
                'Export': report.export,
                'Secure Investment': report.secureInvestment,
                'Increase Services': report.increaseServices,
                'Change Strategy': report.changeStrategy,
                'Improved Product/Service': report.improvedProductService,
                'Other': report.other,
              }).map(([key, value]) => ({
                key,
                value: stripHTMLTags(value || ''),
              }))
            ),
            createSectionDivider(),
            createHeading('Impact - Company', HeadingLevel.HEADING_2),
            createStyledTable([
              { key: 'New Expertise', value: stripHTMLTags(report.newExpertise) },
              { key: 'Students Hired', value: stripHTMLTags(report.studentsHired) },
              { key: 'Referral', value: stripHTMLTags(report.referral) },
              { key: 'Present Results', value: stripHTMLTags(report.presentResults) },
              { key: 'Media Coverage', value: stripHTMLTags(report.mediaCoverage) },
            ]),
            ...(report.team?.length
              ? [
                  createSectionDivider(),
                  createHeading('Team', HeadingLevel.HEADING_2),
                  createStyledTable(
                    report.team.map((member: any) => ({
                      key: member.name,
                      value: member.expertise,
                    }))
                  ),
                ]
              : []),
            ...(report.tags?.length
              ? [
                  createSectionDivider(),
                  createHeading('Tags', HeadingLevel.HEADING_2),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: report.tags.map((tag: string) => `#${tag}`).join(', '),
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    spacing: { before: 200, after: 200 },
                  }),
                ]
              : []),
            // Internal Details intentionally omitted.
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Report-${report.projectId || report.id}.docx`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    toast.success('Document exported successfully!');
  } catch (error) {
    console.error('Error exporting document:', error);
    toast.error('Error exporting document.');
  }
};

/* -------------------- HTML Print Function -------------------- */

// When the user clicks the Print button, call window.print() so that
// your media print CSS (defined in your SCSS) formats the page for print.
const handlePrint = () => {
  window.print();
};

/* -------------------- REPORT DETAILS COMPONENT -------------------- */

/**
 * ReportDetails component fetches and displays detailed information about a specific report.
 * It uses the report ID from the URL query parameters to fetch the report details from a GraphQL API.
 * The component also provides functionality to edit the report, print it, and export it to DOCX format.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * <ReportDetails />
 * 
 * @remarks
 * This component relies on several hooks and utility functions:
 * - `useRouter` from `next/router` to access the report ID from the URL.
 * - `useState` and `useEffect` from `react` to manage state and side effects.
 * - `API` and `graphqlOperation` from `aws-amplify` to perform GraphQL queries.
 * - `toast` from `react-toastify` to display notifications.
 * - `FontAwesomeIcon` from `@fortawesome/react-fontawesome` for icons.
 * 
 * The component fetches report details and images asynchronously and updates the state accordingly.
 * It also handles various user interactions such as navigating back, opening/closing the edit modal,
 * and saving changes to the report.
 * 
 * @function fetchReportDetails
 * Fetches the report details based on the report ID and updates the state.
 * 
 * @function fetchImages
 * Fetches images related to the report's project title and updates the state.
 * 
 * @function handleBackClick
 * Navigates back to the home page.
 * 
 * @function handleOpenModal
 * Opens the edit report modal.
 * 
 * @function handleCloseModal
 * Closes the edit report modal.
 * 
 * @function handleSaveChanges
 * Saves the updated report details and closes the edit report modal.
 * 
 * @function handlePrint
 * Prints the report.
 * 
 * @function exportToDocx
 * Exports the report to DOCX format.
 * 
 * @param {string} id - The report ID from the URL query parameters.
 * @param {any} report - The report details fetched from the API.
 * @param {string[]} imageLinks - The list of image URLs related to the report.
 * @param {boolean} isModalOpen - The state indicating whether the edit modal is open.
 * @param {function} setReport - Updates the report state.
 * @param {function} setImageLinks - Updates the image links state.
 * @param {function} setIsModalOpen - Updates the modal open state.
 * @param {function} fetchReportDetails - Fetches the report details.
 * @param {function} fetchImages - Fetches the images related to the report.
 * @param {function} handleBackClick - Handles the back button click event.
 * @param {function} handleOpenModal - Handles the open modal button click event.
 * @param {function} handleCloseModal - Handles the close modal button click event.
 * @param {function} handleSaveChanges - Handles saving changes to the report.
 * @param {function} handlePrint - Handles printing the report.
 * @param {function} exportToDocx - Handles exporting the report to DOCX format.
 */
const ReportDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<any>(null);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch report details when "id" is available.
  useEffect(() => {
    if (!id) return;
    const fetchReportDetails = async () => {
      try {
        const response: any = await API.graphql(
          graphqlOperation(queries.getReport, { id })
        );
        if (response.data && response.data.getReport) {
          const fetchedReport = response.data.getReport;
          const start = new Date(fetchedReport.startDate);
          const end = new Date(fetchedReport.endDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
            const daysDiff = Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
            );
            fetchedReport.duration = `${daysDiff} days`;
          } else {
            fetchedReport.duration = 'N/A';
          }
          const funding = parseFloat(fetchedReport.funding || '0');
          fetchedReport.totalCost = `$${funding.toFixed(0)}`;
          setReport(fetchedReport);
          fetchImages(fetchedReport.projectTitle);
        }
      } catch (error) {
        console.error('Error fetching report details:', error);
        toast.error('Error fetching report details.');
      }
    };
    fetchReportDetails();
  }, [id]);

  const fetchImages = async (projectTitle: string) => {
    try {
      const response: any = await API.graphql(
        graphqlOperation(queries.getImage, { projectName: projectTitle })
      );
      setImageLinks(response.data.getImage || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = (updatedReport: any) => {
    setReport(updatedReport);
    setIsModalOpen(false);
    toast.success('Report updated successfully!');
  };

  if (!report) {
    return <div className={styles.loading}>Loading report details...</div>;
  }

  return (
    <div className={styles.mainContainer}>
      <button onClick={handleBackClick} className={styles.backButton}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <div className={styles.headerContainer}>
        <h1 className={styles.reportTitle}>{report.projectTitle}</h1>
        <div className={styles.actionButtons}>
          <button onClick={handlePrint} className={styles.exportPDFButton}>
            <FontAwesomeIcon icon={faFilePdf} /> Print
          </button>
          <button onClick={() => exportToDocx(report)} className={styles.exportWordButton}>
            <FontAwesomeIcon icon={faFileWord} /> DOCX
          </button>
          <button onClick={handleOpenModal} className={styles.editButton}>
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
        </div>
      </div>
      {/* Main Screen Content */}
      <div id="pdf-content">
        <div className={styles.overviewCards}>
          {[
            { label: ' Partner', value: report.industrialPartner },
            { label: 'Partner Type', value: report.partnerType },
            { label: 'Start Date', value: report.startDate },
            { label: 'End Date', value: report.endDate },
            { label: 'Duration', value: report.duration },
            { label: 'Funding Source', value: report.sourceFunding },
            { label: 'Total Cost', value: report.totalCost },
          ].map((item, index) => (
            <div key={index} className={styles.card}>
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
        <div className={styles.section}>
          <h2>Summary &amp; Details</h2>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <th>Summary</th>
                <td>{stripHTMLTags(report.inlineSummary)}</td>
              </tr>
              <tr>
                <th>Opportunity</th>
                <td>{stripHTMLTags(report.opportunity)}</td>
              </tr>
              <tr>
                <th>Problem</th>
                <td>{stripHTMLTags(report.problem)}</td>
              </tr>
              <tr>
                <th>Intervention</th>
                <td>{stripHTMLTags(report.intervention)}</td>
              </tr>
              <tr>
                <th>Results</th>
                <td>{stripHTMLTags(report.results)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.section}>
          <h2>Impact - Organization</h2>
          <table className={styles.infoTable}>
            <tbody>
              {[
                'goToMarket',
                'increaseRevenue',
                'decreaseCosts',
                'hireEmployees',
                'registerNewIntellectualProperty',
                'export',
                'secureInvestment',
                'increaseServices',
                'changeStrategy',
                'improvedProductService',
                'other',
              ].map((key, index) => (
                <tr key={index}>
                  <th>{formatKey(key)}</th>
                  <td>{stripHTMLTags(report[key] || '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.section}>
          <h2>Impact - Company</h2>
          <table className={styles.infoTable}>
            <tbody>
              {['newExpertise', 'studentsHired', 'referral', 'presentResults', 'mediaCoverage'].map(
                (key, index) => (
                  <tr key={index}>
                    <th>{formatKey(key)}</th>
                    <td>{stripHTMLTags(report[key] || '')}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {report.team && report.team.length > 0 && (
          <div className={styles.section}>
            <h2>Team</h2>
            <div className={styles.teamContainer}>
              {(report.team || []).map(
                (member: any, index: number) =>
                  member.name && (
                    <div key={index} className={styles.teamCard}>
                      <h3>{member.name}</h3>
                      <p>{member.expertise}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
        {report.tags && report.tags.length > 0 && (
          <div className={styles.section}>
            <h2>Tags</h2>
            <div className={styles.tagsContainer}>
              {(report.tags || []).map((tag: string, index: number) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {imageLinks.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.imagesHeading}>Images</h2>
            <div className={styles.imagesContainer}>
              {imageLinks.map((link, index) => {
                const imageName = decodeURIComponent(
                  link.split('?')[0].split('/').pop() || ''
                );
                return (
                  <div
                    key={index}
                    className={styles.imageWrapper}
                    onClick={() => window.open(link, '_blank')}
                  >
                    <img
                      src={link}
                      alt={`Preview ${index + 1}`}
                      className={styles.imagePreview}
                    />
                    <p>{imageName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {report.internalDetails && (
          <div className={styles.section}>
            <h2 className={styles.internalHeading}>Internal Details</h2>
            <div className={styles.internalDetails}>
              {stripHTMLTags(report.internalDetails)}
            </div>
          </div>
        )}
      </div>
      {/* End of screen content */}
      
      {isModalOpen && (
        <EditReportModal
          report={report}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default ReportDetails;
