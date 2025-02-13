// src/pages/Settings.tsx
import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import SignUpCodeForm from '../components/SignUpCodeForm';
import awsExports from '../aws-exports';
import styles from '../styles/Settings.module.scss';

Amplify.configure(awsExports);
Auth.configure(awsExports);

/**
 * Settings component that fetches the user group of the currently authenticated user
 * and conditionally renders content based on the user's group.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <Settings />
 *
 * @remarks
 * This component uses AWS Amplify's Auth module to fetch the current authenticated user
 * and determine their group. If the user belongs to the 'Admin' group, a form for signing
 * up codes is displayed. Otherwise, a message indicating lack of permission is shown.
 *
 * @function
 * @name Settings
 */
const Settings: React.FC = () => {
  const [userGroup, setUserGroup] = useState<string>('');

  const fetchUserGroup = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userGroupArray = user?.signInUserSession?.idToken?.payload['cognito:groups'];
      if (userGroupArray && userGroupArray.length > 0) {
        setUserGroup(userGroupArray[0]);
        console.log("User Group: ", userGroupArray[0]);
      }
    } catch (error) {
      console.error("Error fetching user group:", error);
    }
  };

  useEffect(() => {
    fetchUserGroup();
  }, []);

  return (
    <div className={styles.mainSettingsContainer}>
      <h1 className={styles.settingsHeader}>Settings</h1>
      {userGroup === 'Admin' ? (
        <div className={styles.formContainer}>
          <SignUpCodeForm />
        </div>
      ) : (
        <p>You do not have permission to view this page.</p>
      )}
    </div>
  );
};

export default Settings;
