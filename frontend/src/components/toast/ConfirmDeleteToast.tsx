// src/components/toast/ConfirmDeleteToast.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/ConfirmDeleteToast.module.scss'

import { ConfirmDeleteToastProps } from '../../types/ConfirmDeleteToastProps';

/**
 * ConfirmDeleteToast component renders a confirmation dialog for deleting a report.
 * 
 * @component
 * @param {ConfirmDeleteToastProps} props - The properties for the ConfirmDeleteToast component.
 * @param {string} props.reportId - The ID of the report to be deleted.
 * @param {function} props.onConfirm - The function to call when the delete action is confirmed.
 * @param {function} props.onClose - The function to call when the dialog is closed.
 * 
 * @returns {JSX.Element} The rendered ConfirmDeleteToast component.
 */
const ConfirmDeleteToast: React.FC<ConfirmDeleteToastProps> = ({ reportId, onConfirm, onClose }) => {
  const handleConfirmClick = async () => {
    await onConfirm(reportId);
    onClose();
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.toastContainer}>
        <div className={styles.header}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} />
          <h3>Are you sure?</h3>
        </div>
        <p className={styles.message}>
          Are you sure you want to delete this report? This action cannot be undone.
        </p>
        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={handleConfirmClick}>
            Yes
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteToast;
