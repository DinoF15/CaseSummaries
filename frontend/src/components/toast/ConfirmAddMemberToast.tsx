// File: components/ConfirmAddMemberToast.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { ConfirmAddMemberToastProps } from '../../types/ConfirmAddMemberToastProps';



/**
 * ConfirmAddMemberToast component allows users to add a new team member by entering their name.
 * It displays a toast notification with input and action buttons for confirmation or cancellation.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {function} props.onConfirm - The function to call when the user confirms the addition of a new member.
 * @param {function} props.onClose - The function to call when the user cancels the action.
 *
 * @returns {JSX.Element} The rendered ConfirmAddMemberToast component.
 *
 * @example
 * <ConfirmAddMemberToast onConfirm={handleConfirm} onClose={handleClose} />
 */
const ConfirmAddMemberToast: React.FC<ConfirmAddMemberToastProps> = ({ onConfirm, onClose }) => {
  const [memberName, setMemberName] = useState<string>('');

  const handleConfirmClick = async () => {
    if (!memberName.trim()) {
      toast.error("Please enter a team member name");
      return;
    }

    try {
      await onConfirm(memberName.trim());
      onClose();
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  return (
    <div className="custom-confirm-toast">
      <div className="confirm-header">
        <FontAwesomeIcon icon={faUserPlus} size="lg" />
        <h3>Add New Team Member</h3>
      </div>
      <p>Enter the name of the new team member:</p>
      
      <input 
        type="text"
        placeholder="Team member name"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
        className="member-name-input"
        autoFocus
      />

      <div className="confirm-buttons">
        <button 
          className="confirm-btn" 
          onClick={handleConfirmClick}
          disabled={!memberName.trim()}
        >
          Add Member
        </button>
        <button 
          className="cancel-btn" 
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmAddMemberToast;
