import React from 'react';
import styles from '../styles/LogOutButton.module.scss';

/**
 * LogoutButton component renders a button that triggers the logout process.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onLogout - The function to call when the button is clicked.
 *
 * @returns {JSX.Element} The rendered button component.
 */
export const LogoutButton: React.FC<{
  onLogout: () => void;
}> = ({onLogout}) => {
  const handleClick = () => {
    onLogout();
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles['button-is-primary']} ${styles['main-logout']}`}
    >
      Sign out
    </button>
  );
};
