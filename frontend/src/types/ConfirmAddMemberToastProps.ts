/**
 * Props for the ConfirmAddMemberToast component.
 */
export interface ConfirmAddMemberToastProps {
    onConfirm: (memberName: string) => Promise<void> | void;
    onClose: () => void;
  }