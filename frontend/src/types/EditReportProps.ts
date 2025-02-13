import { ReportFormData } from './ReportFormData';
/**
 * Props for the EditReport component.
 *
 * @interface EditReportProps
 * @property {ReportFormData} report - The data of the report to be edited.
 * @property {() => void} onClose - Callback function to handle the close action.
 */
export interface EditReportProps {
    report: ReportFormData;
    onClose: () => void;
    onSave: (updatedReport: ReportFormData) => void;
    isOpen: boolean;
  }