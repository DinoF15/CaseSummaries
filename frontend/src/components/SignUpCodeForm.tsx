// src/components/SignUpCodeForm.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { toast } from "react-toastify";
import styles from "../styles/SignUpCodeForm.module.scss";

interface SignUpCodeFormProps {}

/**
 * SignUpCodeForm component allows users to generate a single-use registration code
 * based on the selected account type. It fetches available codes from the backend,
 * assigns a code to the user, and generates a new code to maintain the pool of available codes.
 *
 * @component
 * @example
 * return (
 *   <SignUpCodeForm />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @typedef {Object} SignUpCodeFormProps
 *
 * @function randomString
 * @description Generates a random code string with a prefix based on the selected account type.
 * @param {number} length - Number of random characters to generate.
 * @param {string} chars - A string with characters to use (e.g. "#aA!" for numbers, lowercase, uppercase, and symbols).
 * @returns {string} A string code with the appropriate prefix.
 *
 * @function fetchCodes
 * @description Fetches the list of available registration codes for the given group.
 *
 * @function updateCodes
 * @description Updates the available and assigned codes by removing the first available code,
 * adding it to assigned codes, and generating a new code to push into available codes.
 *
 * @function handleChangeSelect
 * @description Handles the change event for the account type selection dropdown.
 * @param {ChangeEvent<HTMLSelectElement>} e - The change event object.
 *
 * @function handleSubmit
 * @description Handles the form submission, fetching and updating codes.
 * @param {FormEvent<HTMLFormElement>} e - The form event object.
 *
 * @function useEffect
 * @description Logs the group type whenever it changes.
 */
const SignUpCodeForm: React.FC<SignUpCodeFormProps> = () => {
  const [groupType, setGroupType] = useState<string>("");
  const [uniqueCode, setUniqueCode] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  /**
   * Generates a random code string with a prefix based on the selected account type.
   * @param length Number of random characters to generate.
   * @param chars A string with characters to use (e.g. "#aA!" for numbers, lowercase, uppercase, and symbols).
   * @returns A string code with the appropriate prefix.
   */
  const randomString = (length: number, chars: string): string => {
    let prefix = "";
    switch (groupType) {
      case "Admin":
        prefix = "AD";
        break;
      case "Operator":
        prefix = "OP";
        break;
      case "Supervisor":
        prefix = "MA";
        break;
      default:
        prefix = "GU";
        break;
    }
    let mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += mask[Math.floor(Math.random() * mask.length)];
    }
    const finalCode = prefix.concat(result);
    console.log("Created code: ", finalCode);
    return finalCode;
  };

  /**
   * Fetches the list of available registration codes for the given group.
   */
  const fetchCodes = async () => {
    try {
      const response: any = await API.graphql(
        graphqlOperation(queries.getSignUpCode, { id: groupId })
      );
      const codes: string[] = response.data.getSignUpCode.CurrentlyAvailableCodes;
      console.log("CODES BEFORE SPLIT: ", codes);
      if (codes.length > 0) {
        setUniqueCode(codes[0]);
      } else {
        setUniqueCode("No code available");
      }
    } catch (err) {
      console.error("Error fetching codes:", err);
    }
  };

  /**
   * Updates the available and assigned codes by removing the first available code,
   * adding it to assigned codes, and generating a new code to push into available codes.
   */
  const updateCodes = async () => {
    try {
      const response: any = await API.graphql(
        graphqlOperation(queries.getSignUpCode, { id: groupId })
      );
      const codes: string[] = response.data.getSignUpCode.CurrentlyAvailableCodes;
      const assignedCodes: string[] = response.data.getSignUpCode.AssignedCodes;
      if (codes.length > 0) {
        // Remove the first available code and push it to assigned
        const removedCode = codes.shift() as string;
        assignedCodes.push(removedCode);
        setUniqueCode(removedCode);

        // Generate a new code and add it to the available list
        const newCode = randomString(16, "#aA!");
        codes.push(newCode);

        // Update the codes using a GraphQL mutation
        await API.graphql(
          graphqlOperation(mutations.updateSignUpCode, {
            dbItem: {
              id: groupId,
              CurrentlyAvailableCodes: codes,
              AssignedCodes: assignedCodes
            }
          })
        );
        setSuccess(true);
        setFeedback("Successfully created code.");
      } else {
        setUniqueCode("No code available");
      }
    } catch (err) {
      console.error("Error updating codes:", err);
      setSuccess(false);
      setFeedback("Error: Registration code could not be created.");
    }
  };

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setGroupId(value);
    const groupNum = parseInt(value);
    let group = "";
    switch (groupNum) {
      case 1:
        group = "Admin";
        break;
      case 2:
        group = "Supervisor";
        break;
      case 3:
        group = "Operator";
        break;
      case 4:
        group = "Guest";
        break;
      default:
        group = "";
    }
    setGroupType(group);
    setShowCode(false);
    setFeedback("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchCodes();
    await updateCodes();
    setShowCode(true);
  };

  useEffect(() => {
    console.log("GROUP CHANGED: ", groupType);
  }, [groupType]);

  return (
    <div className={styles.formContainerSm}>
      <legend className={styles.caption}>Generate Registration Code</legend>
      <form className={styles.createProjectForm} onSubmit={handleSubmit}>
        <div className={styles.column}>
          <label htmlFor="partnerType" className={styles.formLabel}>Account Type :</label>
          <select
            name="partnerType"
            className={styles.formControl}
            value={groupId}
            onChange={handleChangeSelect}
          >
            <option disabled value="">
              Select user type...
            </option>
            <option value="1">Admin</option>
            <option value="2">Supervisor</option>
            <option value="3">Operator</option>
            <option value="4">Guest</option>
          </select>
        </div>
        {showCode && (
          <div className={styles.column}>
            <label className={styles.formLabel}>Single-Use Registration Code (read-only):</label>
            <input
              type="text"
              name="registrationCode"
              value={uniqueCode}
              placeholder="ex: AD12345"
              autoComplete="off"
              className={styles.formControl}
              disabled
            />
          </div>
        )}
        <br />
        <button type="submit" className={styles.formBtn} name="Send">
          Get Code
        </button>
        <br />
        <legend className={success ? styles.feedbackSuccess : styles.feedbackFail}>
          {feedback}
        </legend>
      </form>
    </div>
  );
};

export default SignUpCodeForm;
