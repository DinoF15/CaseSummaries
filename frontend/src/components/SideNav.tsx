import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Amplify, Auth } from 'aws-amplify';
import { CSS_CLASSES, ROUTES, NAV_TEXT } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import styles from '../styles/SideNav.module.scss';
import awsExports from '../aws-exports';
import { SideNavProps } from '../types/SideNavProps';

Amplify.configure(awsExports);



/**
 * SideNav component that renders a side navigation bar with collapsible functionality.
 * 
 * @component
 * @param {SideNavProps} props - The props for the SideNav component.
 * @param {boolean} props.isCollapsed - Indicates whether the side navigation is collapsed.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsCollapsed - Function to set the collapsed state of the side navigation.
 * 
 * @returns {JSX.Element} The rendered SideNav component.
 * 
 * @example
 * <SideNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
 * 
 * @remarks
 * The component fetches the user group on mount and handles the expand/collapse functionality for dropdowns.
 * 
 * @function
 * @name handleExpand
 * @param {React.MouseEvent<HTMLButtonElement>} event - The mouse event triggered by clicking the button.
 * @param {boolean} showDropDown - Indicates whether the dropdown is currently shown.
 * @param {Function} setDropDownClass - Function to set the dropdown class.
 * @param {Function} setBtnClass - Function to set the button class.
 * @param {Function} setCaretClass - Function to set the caret class.
 * @param {Function} setShowDropDown - Function to set the dropdown visibility state.
 * @param {string} hideClass - CSS class to hide the dropdown.
 * @param {string} showClass - CSS class to show the dropdown.
 * @param {string} btnClass - CSS class for the button.
 * @param {string} btnActiveClass - CSS class for the active button.
 * @param {string} caretLeftClass - CSS class for the left caret.
 * @param {string} caretDownClass - CSS class for the down caret.
 */
const SideNav: React.FC<SideNavProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [userGroup, setUserGroup] = useState<string | null>(null);
//   const [dashboardDropDownClass, setDashboardDropDownClass] = useState<string>(CSS_CLASSES.HIDE_DROPDOWN);
//   const [showDashboardDropDown, setShowDashboardDropDown] = useState<boolean>(false);
//   const [dashboardBtnClass, setDashboardBtnClass] = useState<string>(CSS_CLASSES.DROPDOWN_BTN);
//   const [dashboardCaretClass, setDashboardCaretClass] = useState<string>(CSS_CLASSES.CARET_LEFT);

  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const userGroupArray = user?.signInUserSession?.idToken?.payload['cognito:groups'];
        if (userGroupArray) {
          setUserGroup(userGroupArray[0]);
        }
      } catch (error) {
        console.error("Error fetching user group:", error);
      }
    };
    fetchUserGroup();
  }, []);

  const handleExpand = (
    event: React.MouseEvent<HTMLButtonElement>,
    showDropDown: boolean,
    setDropDownClass: (value: string) => void,
    setBtnClass: (value: string) => void,
    setCaretClass: (value: string) => void,
    setShowDropDown: (value: boolean) => void,
    hideClass: string,
    showClass: string,
    btnClass: string,
    btnActiveClass: string,
    caretLeftClass: string,
    caretDownClass: string
  ) => {
    event.preventDefault();
    if (showDropDown) {
      setDropDownClass(hideClass);
      setBtnClass(btnClass);
      setCaretClass(caretLeftClass);
    } else {
      setDropDownClass(showClass);
      setBtnClass(btnActiveClass);
      setCaretClass(caretDownClass);
    }
    setShowDropDown(!showDropDown);
  };
  return (
    <nav className={`${styles.navSide} ${isCollapsed ? styles.collapsed : ''}`} role="navigation" aria-label="main navigation">
      <div className={`${styles.logoContainer} ${isCollapsed ? styles.collapsed : ''}`}>
        {/* <Link href="/">
        <Image 
            src="/yourlogo.png" 
            alt=" Logo" 
            width={200} 
            height={50} 
            priority 
          />        </Link> */}
      </div>
      <button className={`${styles.collapseButton} ${isCollapsed ? styles.collapsedButton : ''}`} onClick={() => setIsCollapsed(!isCollapsed)}>
        <FontAwesomeIcon icon={isCollapsed ? faBars : faClose} size="xl" />
      </button>
      
      {/* <button
        className={dashboardBtnClass}
        onClick={(e) => handleExpand(
          e,
          showDashboardDropDown,
          setDashboardDropDownClass,
          setDashboardBtnClass,
          setDashboardCaretClass,
          setShowDashboardDropDown,
          CSS_CLASSES.HIDE_DROPDOWN,
          CSS_CLASSES.SHOW_DROPDOWN,
          CSS_CLASSES.DROPDOWN_BTN,
          CSS_CLASSES.DROPDOWN_BTN_ACTIVE,
          CSS_CLASSES.CARET_LEFT,
          CSS_CLASSES.CARET_DOWN
        )}
      >
        {NAV_TEXT.CREATE_REPORT}
        <i className={dashboardCaretClass}></i>
      </button> */}
      
        <Link href={ROUTES.CREATE_REPORT}>{NAV_TEXT.CREATE_REPORT}</Link>
        <Link href={ROUTES.RETRIEVE_REPORT}>{NAV_TEXT.RETRIEVE_REPORT}</Link>
        <Link href={ROUTES.ANALYZE_REPORT}>{NAV_TEXT.ANALYZE_REPORT}</Link>
        <Link href={ROUTES.SETTINGS}>{NAV_TEXT.SETTINGS}</Link>
    </nav>
  );
};

export default SideNav;
