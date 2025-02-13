/**
 * Props for the ConfirmDeleteToast component.
 *
 * @interface ConfirmDeleteToastProps
 * @property {string} reportId - The ID of the report to be deleted.
 * @property {(reportId: string) => Promise<void>} onConfirm - Callback function to be called when the delete action is confirmed. It receives the report ID as an argument and returns a promise.
 * @property {() => void} onClose - Callback function to be called when the toast is closed.
 */
export interface ConfirmDeleteToastProps {
    reportId: string;
    onConfirm: (reportId: string) => Promise<void>;
    onClose: () => void;
  }