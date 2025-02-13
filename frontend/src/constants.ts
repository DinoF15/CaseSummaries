import sideNavStyles from './styles/SideNav.module.scss';


/**
 * A collection of CSS class names used for styling dropdown components in the side navigation.
 * 
 * @constant
 * @type {Object}
 * @property {string} HIDE_DROPDOWN - Class names for hiding the dropdown container.
 * @property {string} SHOW_DROPDOWN - Class names for showing the dropdown container.
 * @property {string} DROPDOWN_BTN - Class name for the primary dropdown button.
 * @property {string} DROPDOWN_BTN_2 - Class name for the secondary dropdown button.
 * @property {string} DROPDOWN_BTN_ACTIVE - Class names for the active state of the primary dropdown button.
 * @property {string} DROPDOWN_BTN_2_ACTIVE - Class names for the active state of the secondary dropdown button.
 * @property {string} CARET_LEFT - FontAwesome class for a left-pointing caret icon.
 * @property {string} CARET_DOWN - FontAwesome class for a down-pointing caret icon.
 * @property {string} ACTIVE - Class name for the active state.
 */
export const CSS_CLASSES = {
    HIDE_DROPDOWN: `${sideNavStyles['dropdown-container']} ${sideNavStyles['hide-dropdown']}`,
    SHOW_DROPDOWN: `${sideNavStyles['dropdown-container']} ${sideNavStyles['show-dropdown']}`,
    DROPDOWN_BTN: `${sideNavStyles['dropdown-btn']}`,
    DROPDOWN_BTN_2: `${sideNavStyles['dropdown-btn-2']}`,
    DROPDOWN_BTN_ACTIVE: `${sideNavStyles['dropdown-btn']} ${sideNavStyles['active']}`,
    DROPDOWN_BTN_2_ACTIVE: `${sideNavStyles['dropdown-btn-2']} ${sideNavStyles['active']}`,
    CARET_LEFT: 'fa fa-caret-left',
    CARET_DOWN: 'fa fa-caret-down',
    ACTIVE: `${sideNavStyles['active']}`,
  };

// 
/**
 * An object containing the route paths for the application.
 * 
 * @constant
 * @type {Object}
 * @property {string} CREATE_REPORT - Path for creating a report.
 * @property {string} RETRIEVE_REPORT - Path for retrieving a report.
 * @property {string} ANALYZE_REPORT - Path for analyzing a report.
 * @property {string} SETTINGS - Path for accessing settings.
 */
export const ROUTES = {
  CREATE_REPORT: '/CreateReport',
  RETRIEVE_REPORT: '/',
  ANALYZE_REPORT: '/Claude',
  SETTINGS: '/Settings'
};


/**
 * An object containing navigation text constants for different sections of the application.
 * 
 * @constant
 * @type {Object}
 * @property {string} CREATE_REPORT - Text for the "Create Report" section.
 * @property {string} RETRIEVE_REPORT - Text for the "Retrieve Report" section.
 * @property {string} ANALYZE_REPORT - Text for the "Analyze Report" section.
 * @property {string} SETTINGS - Text for the "Settings" section.
 */
export const NAV_TEXT = {
CREATE_REPORT : 'Create Report',
RETRIEVE_REPORT : 'Retrieve Report',
ANALYZE_REPORT : 'Analyze Report',
SETTINGS: 'Settings'
};