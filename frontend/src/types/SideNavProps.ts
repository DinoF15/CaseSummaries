/**
 * Interface representing the properties for the Side Navigation component.
 */
export interface SideNavProps {
    /**
     * Indicates whether the side navigation is collapsed.
     */
    isCollapsed: boolean;

    /**
     * Function to set the collapsed state of the side navigation.
     * @param value - The new collapsed state.
     */
    setIsCollapsed: (value: boolean) => void;
}
  