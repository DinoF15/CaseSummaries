import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { toast } from "react-toastify";
import ConfirmAddMemberToast from "../components/toast/ConfirmAddMemberToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import { createReport } from "../dataCalls/createReport";
import { createImage } from "../dataCalls/createImage";
import { createStaffList } from "../dataCalls/createStaffList"; // data call for creating staff

// Dynamically import ReactQuill (client-side only)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

import styles from "../styles/CreateReport.module.scss";

import { ImageFileProps } from "../types/ImageFileProps";
type ImageFile = ImageFileProps;

import { ReportFormData } from "../types/ReportFormData";
import { TeamMember } from "../types/TeamMember";



/**
 * The initial state for the report form data.
 * 
 * @typedef {Object} ReportFormData
 * @property {string} id - The unique identifier for the report.
 * @property {string} projectTitle - The title of the project.
 * @property {string} industrialPartner - The industrial partner involved in the project.
 * @property {string} projectContact - The contact person for the project.
 * @property {string} startDate - The start date of the project.
 * @property {string} endDate - The end date of the project.
 * @property {string} duration - The duration of the project.
 * @property {string} partnerCash - The cash contribution from the partner.
 * @property {string} partnerInKind - The in-kind contribution from the partner.
 * @property {string} funding - The funding amount for the project.
 * @property {string} sourceFunding - The source of the funding.
 * @property {string} inlineSummary - An inline summary of the project.
 * @property {string} briefSummary - A brief summary of the project.
 * @property {string} opportunity - The opportunity addressed by the project.
 * @property {string} problem - The problem addressed by the project.
 * @property {string} intervention - The intervention or solution provided by the project.
 * @property {string} results - The results of the project.
 * @property {string} projectId - The project identifier.
 * @property {string} goToMarket - The go-to-market strategy.
 * @property {string} increaseRevenue - Information on how the project will increase revenue.
 * @property {string} decreaseCosts - Information on how the project will decrease costs.
 * @property {string} hireEmployees - Information on hiring employees.
 * @property {string} registerNewIntellectualProperty - Information on registering new intellectual property.
 * @property {string} export - Information on exporting.
 * @property {string} secureInvestment - Information on securing investment.
 * @property {string} increaseServices - Information on increasing services.
 * @property {string} changeStrategy - Information on changing strategy.
 * @property {string} improvedProductService - Information on improving product or service.
 * @property {string} other - Other relevant information.
 * @property {string} newExpertise - Information on new expertise gained.
 * @property {string} studentsHired - Information on students hired.
 * @property {string} referral - Referral information.
 * @property {string} presentResults - Information on presenting results.
 * @property {string} mediaCoverage - Information on media coverage.
 * @property {Array<{name: string, expertise: string}>} team - The team members involved in the project.
 * @property {Array<string>} tags - The tags associated with the project.
 * @property {string} currentTag - The current tag being used.
 * @property {string} projectType - The type of the project.
 * @property {string} internalDetails - Internal details of the project.
 * @property {string} partnerType - The type of partner involved.
 * @property {Array<string>} images - The images associated with the project.
 * @property {string} updatedAt - The last updated date of the report.
 * @property {string} otherFundingSource - Other sources of funding.
 */
const initialReport: ReportFormData = {
  id: "",
  projectTitle: "",
  industrialPartner: "",
  projectContact: "",
  startDate: "",
  endDate: "",
  duration: "",
  partnerCash: "",
  partnerInKind: "",
  funding: "",
  sourceFunding: "",
  inlineSummary: "",
  briefSummary: "",
  opportunity: "",
  problem: "",
  intervention: "",
  results: "",
  projectId: "",
  goToMarket: "",
  increaseRevenue: "",
  decreaseCosts: "",
  hireEmployees: "",
  registerNewIntellectualProperty: "",
  export: "",
  secureInvestment: "",
  increaseServices: "",
  changeStrategy: "",
  improvedProductService: "",
  other: "",
  newExpertise: "",
  studentsHired: "",
  referral: "",
  presentResults: "",
  mediaCoverage: "",
  team: [
    { name: "", expertise: "" },
    { name: "", expertise: "" },
    { name: "", expertise: "" },
  ],
  tags: [],
  currentTag: "",
  projectType: "",
  internalDetails: "",
  partnerType: "",
  images: [],
  updatedAt: "",
  otherFundingSource: "",
};


/**
 * Filters the list of tag suggestions based on the input string.
 *
 * @param input - The input string to filter the tags by.
 * @param allTags - The array of all available tags.
 * @returns An array of tags that include the input string, case-insensitive.
 */
const filterTagSuggestions = (input: string, allTags: string[]): string[] => {
  return allTags.filter((tag) =>
    tag.toLowerCase().includes(input.toLowerCase())
  );
};

/**
 * Helper function to remove a tag from the tags array at the specified index.
 *
 * @param indexToRemove - The index of the tag to be removed.
 * @param tags - The array of tags.
 * @returns A new array of tags with the specified tag removed.
 */
const handleRemoveTagHelper = (indexToRemove: number, tags: string[]): string[] => {
  return tags.filter((_, idx) => idx !== indexToRemove);
};


/**
 * CreateReport component handles the creation of a new report through a multi-step form.
 * 
 * @component
 * @example
 * return (
 *   <CreateReport />
 * )
 * 
 * @returns {JSX.Element} The rendered CreateReport component.
 * 
 * @description
 * This component manages the state and logic for a multi-step form used to create a new report.
 * It includes form validation, state management for form fields, and handlers for various form inputs.
 * The form is divided into six steps:
 * 1. Project Information
 * 2. Project Overview
 * 3. Internal Information
 * 4. Partner Impact
 * 5. Company Impact
 * 6. Team, Tags & Images
 * 
 * The component also handles fetching initial data for staff and tags, managing form state, 
 * handling image uploads, and submitting the form data to the backend.
 * 
 * @state {number} currentStep - The current step in the multi-step form.
 * @state {ReportFormData} formData - The state object holding all form data.
 * @state {ImageFile[]} imageFiles - The state array holding uploaded image files.
 * @state {any[]} teamMembers - The state array holding the list of team members.
 * @state {string[]} allTags - The state array holding all available tags.
 * @state {string[]} tagSuggestions - The state array holding tag suggestions based on user input.
 * @state {boolean} isSubmitting - The state boolean indicating if the form is being submitted.
 * @state {boolean} isFormDirty - The state boolean indicating if the form has unsaved changes.
 * @state {Record<string, string>} errors - The state object holding validation errors for form fields.
 * @state {boolean} earlyPromptShown - The state boolean indicating if the early submission prompt has been shown.
 * @state {boolean} newProjectContactVisible - The state boolean indicating if the new project contact input is visible.
 * @state {string} newProjectContactValue - The state string holding the value of the new project contact input.
 * @state {{ [key: number]: string }} newTeamMemberValues - The state object holding values for new team member inputs by index.
 * 
 * @function handleNextStep - Advances to the next step in the form.
 * @function handlePreviousStep - Goes back to the previous step in the form.
 * @function handleInputChange - Handles changes to form inputs.
 * @function handleChangeRichText - Handles changes to rich text inputs.
 * @function handleChange - Handles changes to form inputs and updates formData state.
 * @function handleProjectContactChange - Handles changes to the project contact select input.
 * @function saveNewProjectContact - Saves a new project contact inline.
 * @function handleTeamMemberChange - Handles changes to team member select inputs.
 * @function handleNewTeamMemberChange - Handles changes to new team member inputs.
 * @function saveNewTeamMember - Saves a new team member inline.
 * @function cancelNewTeamMember - Cancels the inline new team member input.
 * @function handleTagChange - Handles changes to the tag input.
 * @function selectTagSuggestion - Selects a tag suggestion.
 * @function addTag - Adds a new tag to the formData state.
 * @function removeTag - Removes a tag from the formData state.
 * @function ensureTagExists - Ensures a tag exists in the database.
 * @function ensureStaffExists - Ensures a staff member exists in the database.
 * @function handleImageChange - Handles changes to the image file input.
 * @function removeFile - Removes an image file from the state.
 * @function handleImageDrop - Handles image file drop events.
 * @function processFiles - Processes dropped image files.
 * @function validate - Validates the entire form.
 * @function validateStep1 - Validates the first step of the form.
 * @function handleSubmitEarly - Handles early submission of the form.
 * @function submitReport - Submits the form data to the backend.
 * @function handleSubmit - Handles the form submission event.
 * 
 * @hook useEffect - Fetches initial data for staff and tags on component mount.
 * @hook useEffect - Marks the form as dirty on input change.
 * @hook useEffect - Warns the user before unloading the page if the form is dirty and not submitting.
 */
const CreateReport: React.FC = () => {
  // Multi-step navigation state (6 steps)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePreviousStep = () => setCurrentStep((prev) => prev - 1);

  // Form state
  const [formData, setFormData] = useState<ReportFormData>(initialReport);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [earlyPromptShown, setEarlyPromptShown] = useState<boolean>(false);
  const [newProjectContactVisible, setNewProjectContactVisible] = useState<boolean>(false);
  const [newProjectContactValue, setNewProjectContactValue] = useState<string>("");
  const [newTeamMemberValues, setNewTeamMemberValues] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    /**
     * Fetches staff and tags from the API and updates the state with the retrieved data.
     * 
     * This function performs two asynchronous operations:
     * 1. Fetches the list of staff members and updates the `teamMembers` state.
     * 2. Fetches the list of tags, processes them to remove duplicates and empty strings, 
     *    and updates the `allTags` state.
     * 
     * In case of an error during either of the fetch operations, an error message is logged 
     * to the console and a toast notification is displayed to the user.
     * 
     * @async
     * @function fetchStaffAndTags
     * @returns {Promise<void>} A promise that resolves when the staff and tags have been fetched and the state has been updated.
     */
    async function fetchStaffAndTags() {
      try {
        const staffRes: any = await API.graphql(graphqlOperation(queries.listStaffList));
        const staffList = staffRes.data?.listStaffList || [];
        setTeamMembers(staffList);

        const tagRes: any = await API.graphql(graphqlOperation(queries.listTagList));
        const tagsFromDb = tagRes.data?.listTags || tagRes.data?.listTagList || [];
        const mappedTags = [
          ...new Set(tagsFromDb.map((t: any) => t.tagName || t.name)),
        ].filter((tag) => typeof tag === "string" && tag.trim() !== "");
        setAllTags(mappedTags as string[]);
      } catch (error) {
        console.error("Error fetching staff/tags:", error);
        toast.error("Failed to load staff and tags");
      }
    }
    fetchStaffAndTags();
  }, []);

  useEffect(() => {
    const checkFormDirty = () => setIsFormDirty(true);
    const formElements = document.querySelectorAll("input, textarea, select");
    formElements.forEach((element) => element.addEventListener("change", checkFormDirty));
    return () => {
      formElements.forEach((element) =>
        element.removeEventListener("change", checkFormDirty)
      );
    };
  }, []);

  // WARN BEFORE UNLOADING, but not if submitting
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormDirty && !isSubmitting) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message;
        return message;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty, isSubmitting]);

  // UTILITY: Remove HTML tags
  const sanitizeHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // HANDLERS FOR INPUTS & RICH TEXT
  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeRichText = (name: keyof ReportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const teamRegex = /^team\[(\d+)\]\.(name|expertise)$/;
    const teamMatch = name.match(teamRegex);
    if (teamMatch) {
      const index = parseInt(teamMatch[1], 10);
      const field = teamMatch[2] as keyof TeamMember;
      setFormData((prev) => ({
        ...prev,
        team: prev.team.map((member, idx) =>
          idx === index ? { ...member, [field]: value } : member
        ),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "sourceFunding" && value !== "Other") {
      setFormData((prev) => ({ ...prev, otherFundingSource: "" }));
    }
    if (name === "startDate" || name === "endDate") {
      setFormData((prev) => {
        if (prev.startDate && prev.endDate) {
          const start = new Date(prev.startDate);
          const end = new Date(prev.endDate);
          if (end > start) {
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
            return { ...prev, duration: `${diff} days` };
          } else {
            return { ...prev, duration: "" };
          }
        }
        return prev;
      });
    }
  };

  // Project Contact handler (using select)
  const handleProjectContactChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === "add_new") {
      setNewProjectContactVisible(true);
    } else {
      setFormData((prev) => ({ ...prev, projectContact: value }));
      setNewProjectContactVisible(false);
    }
  };

  //  Save new Project Contact inline
  const saveNewProjectContact = async () => {
    if (!newProjectContactValue.trim()) {
      toast.error("Please enter a valid name.");
      return;
    }
    try {
      const createInput = {
        name: newProjectContactValue.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result: any = await API.graphql(
        graphqlOperation(mutations.createStaffList, { dbItem: createInput })
      );
      const newStaff = result.data.createStaffList;
      setTeamMembers((prev) => [...prev, newStaff]);
      setFormData((prev) => ({ ...prev, projectContact: newStaff.name }));
      toast.success(`Team member ${newStaff.name} added successfully as Project Contact`);
      setNewProjectContactVisible(false);
      setNewProjectContactValue("");
    } catch (error) {
      console.error("Error adding new project contact:", error);
      toast.error("Failed to add new project contact.");
    }
  };

  // Team Member handler for team array inline addition
  const handleTeamMemberChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { value, name } = event.target;
    if (name === `team[${index}].name` && value === "add_new") {
      // Show inline input for this team member if "add_new" is selected
      setNewTeamMemberValues((prev) => ({ ...prev, [index]: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        team: prev.team.map((member, idx) =>
          idx === index ? { ...member, [name.split(".")[1]]: value } : member
        ),
      }));
    }
  };

  const handleNewTeamMemberChange = (index: number, value: string) => {
    setNewTeamMemberValues((prev) => ({ ...prev, [index]: value }));
  };

  const saveNewTeamMember = async (index: number) => {
    const newName = newTeamMemberValues[index]?.trim();
    if (!newName) {
      toast.error("Please enter a valid team member name.");
      return;
    }
    try {
      const createInput = {
        name: newName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result: any = await API.graphql(
        graphqlOperation(mutations.createStaffList, { dbItem: createInput })
      );
      const newStaff = result.data.createStaffList;
      setTeamMembers((prev) => [...prev, newStaff]);
      setFormData((prev) => {
        const updatedTeam = [...prev.team];
        updatedTeam[index] = { ...updatedTeam[index], name: newStaff.name };
        return { ...prev, team: updatedTeam };
      });
      toast.success(`Team member ${newStaff.name} added successfully`);
      setNewTeamMemberValues((prev) => {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      });
    } catch (error) {
      console.error("Error creating team member:", error);
      toast.error("Failed to add team member.");
    }
  };

  //  Cancel inline team member input
  const cancelNewTeamMember = (index: number) => {
    setNewTeamMemberValues((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setFormData((prev) => {
      const updatedTeam = [...prev.team];
      updatedTeam[index] = { ...updatedTeam[index], name: "" };
      return { ...prev, team: updatedTeam };
    });
  };

  // TAG HANDLERS
  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFormData((prev) => ({ ...prev, currentTag: newValue }));
    const suggestions = filterTagSuggestions(newValue, allTags)
      .filter((tag) => !formData.tags.includes(tag))
      .slice(0, 5);
    setTagSuggestions(suggestions);
  };

  const selectTagSuggestion = (suggestion: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, suggestion],
      currentTag: "",
    }));
    setTagSuggestions([]);
  };

  const addTag = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newTag = formData.currentTag.trim();
    if (
      newTag &&
      !formData.tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())
    ) {
      (async () => {
        try {
          // Use your existing mutation for tags
          await ensureTagExists(newTag);
          setFormData((prev) => ({
            ...prev,
            tags: [...prev.tags, newTag],
            currentTag: "",
          }));
          setTagSuggestions([]);
        } catch (error) {
          console.error("Failed to add tag:", error);
          toast.error("Failed to add tag");
        }
      })();
    } else if (newTag) {
      toast.info("This tag already exists");
    }
  };

  const removeTag = (indexToRemove: number) => {
    const updatedTags = handleRemoveTagHelper(indexToRemove, formData.tags);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const ensureTagExists = async (tagName: string) => {
    try {
      const exists = allTags.includes(tagName);
      if (!exists && tagName) {
        const createInput = {
          tagName: tagName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const result = await API.graphql(
          graphqlOperation(mutations.createTagList, { dbItem: createInput })
        );
        console.log("Created new tag:", result);
        setAllTags((prev) => [...prev, tagName]);
      }
    } catch (error) {
      console.error(`Failed to create tag ${tagName}:`, error);
      toast.error(`Failed to create tag: ${tagName}`);
    }
  };

  const ensureStaffExists = async (staffName: string) => {
    try {
      const exists = teamMembers.some((member) => member.name === staffName);
      if (!exists && staffName) {
        const createInput = {
          name: staffName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const result = await API.graphql(
          graphqlOperation(mutations.createStaffList, { dbItem: createInput })
        );
        console.log("Created new staff:", result);
        setTeamMembers((prev) => [...prev, { name: staffName }]);
      }
    } catch (error) {
      console.error(`Failed to create staff ${staffName}:`, error);
      toast.error(`Failed to create staff: ${staffName}`);
    }
  };

  // IMAGE HANDLERS
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileReaders = files.map(
      (file) =>
        new Promise<ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve({
              filename: file.name,
              base64Data: result.split(",")[1],
            });
          };
          reader.readAsDataURL(file);
        })
    );
    Promise.all(fileReaders).then((files) => {
      setImageFiles((prev) => [...prev, ...files]);
    });
  };

  const removeFile = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      const files = Array.from(event.dataTransfer.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);
      processFiles(files);
    } else {
      processFiles(Array.from(event.dataTransfer.files));
    }
  };

  const processFiles = (files: File[]) => {
    const fileReaders = files.map(
      (file) =>
        new Promise<ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve({
              filename: file.name,
              base64Data: result.split(",")[1],
            });
          };
          reader.readAsDataURL(file);
        })
    );
    Promise.all(fileReaders).then((files) => {
      setImageFiles((prev) => [...prev, ...files]);
    });
  };

  // FULL FORM VALIDATION (for final submit)
  const validate = (): Record<string, string> => {
    let newErrors: Record<string, string> = {};
    if (!formData.projectTitle) newErrors.projectTitle = "Project Title is required";
    if (!formData.industrialPartner) newErrors.industrialPartner = " Partner is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.projectType) newErrors.projectType = "Project Type is required";
    if (formData.tags.length === 0) newErrors.tags = "At least one tag is required";
    if (formData.sourceFunding === "Other" && !formData.otherFundingSource) {
      newErrors.otherFundingSource = "Please specify the funding source";
    }
    return newErrors;
  };

  // STEP 1  EARLY SUBMISSION VALIDATION: Required project fields including Project Contact and Source Funding
  const validateStep1 = (): Record<string, string> => {
    let errors: Record<string, string> = {};
    if (!formData.projectTitle.trim()) errors.projectTitle = "Project Title is required";
    if (!formData.industrialPartner.trim()) errors.industrialPartner = " Partner is required";
    if (!formData.startDate.trim()) errors.startDate = "Start Date is required";
    if (!formData.projectType.trim()) errors.projectType = "Project Type is required";
    if (!formData.projectContact.trim()) errors.projectContact = "Project Contact is required";
    if (!formData.sourceFunding.trim()) errors.sourceFunding = "Source Funding is required";
    return errors;
  };

  // HANDLE SUBMIT EARLY: Validate Step 1 and, if valid, redirect to Step 6
  const handleSubmitEarly = async () => {
    const step1Errors = validateStep1();
    if (Object.keys(step1Errors).length > 0) {
      toast.error("Please complete all required project fields (Project Title,  Partner, Project Contact, Start Date, Project Type, and Source Funding) to submit early.");
      setErrors((prev) => ({ ...prev, ...step1Errors }));
      return;
    }
    setCurrentStep(6);
    let extraErrors: Record<string, string> = {};
    if (!formData.team.some(member => member.name.trim() !== "" && member.expertise.trim() !== "")) {
      extraErrors.team = "At least one team member with expertise is required";
    }
    if (formData.tags.length === 0) {
      extraErrors.tags = "At least one tag is required";
    }
    setErrors((prev) => ({ ...prev, ...extraErrors }));
    if (Object.keys(extraErrors).length > 0) {
      toast.error("Please fill in the required team member and tag details on the last page.");
    }
  };

  // SUBMIT FUNCTION (for full form submit)
  const submitReport = async (): Promise<void> => {
    console.log("Submitting report...");
    console.log("Form data:", formData);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields. Missing fields are highlighted in red.");
      setIsSubmitting(false);
      return;
    }
    try {
      const currentUser: any = await Auth.currentAuthenticatedUser();
      const username = currentUser.username;
      const userData: any = await API.graphql(
        graphqlOperation(queries.getUser, { id: username })
      );
      const userEmail = userData.data.getUser.email;
      const userFirstName = userEmail
        .slice(0, userEmail.search(/[-.]/))
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

      let existingReports: any[] = [];
      try {
        const fetchExistingReports: any = await API.graphql(
          graphqlOperation(queries.listReports)
        );
        existingReports = fetchExistingReports?.data?.listReports || [];
      } catch (err) {
        console.error("Failed to fetch existing reports:", err);
      }

      const projectYear = formData.startDate.split("-")[0];
      const projectTypeAbbreviation = formData.projectType === "External" ? "EP" : "IP";
      const companyNameAbbreviation = formData.industrialPartner.replace(/\s+/g, "");
      const matchingReports = existingReports.filter((report) => {
        const projectId = report.projectId;
        if (!projectId.startsWith(`${projectTypeAbbreviation}_${projectYear}-`)) return false;
        if (!projectId.endsWith(`_${companyNameAbbreviation}`)) return false;
        return true;
      });
      let maxProjectNumber = 0;
      matchingReports.forEach((report) => {
        const pattern = new RegExp(`${projectTypeAbbreviation}_${projectYear}-(\\d+)_${companyNameAbbreviation}`);
        const match = report.projectId.match(pattern);
        if (match && match[1]) {
          const currentNumber = parseInt(match[1], 10);
          if (currentNumber > maxProjectNumber) {
            maxProjectNumber = currentNumber;
          }
        }
      });
      const newProjectNumber = maxProjectNumber + 1;
      const formattedProjectNumber = String(newProjectNumber).padStart(2, "0");
      const newProjectId = `${projectTypeAbbreviation}_${projectYear}-${formattedProjectNumber}_${companyNameAbbreviation}`;

      const filteredTeam = formData.team
        .map(member =>
          member.name && member.expertise ? { name: member.name, expertise: member.expertise } : null
        )
        .filter(Boolean) as TeamMember[];
      for (let member of filteredTeam) {
        await ensureStaffExists(member.name);
      }
      for (let tag of formData.tags) {
        await ensureTagExists(tag);
      }

      const reportInput = {
        projectType: formData.projectType,
        projectTitle: formData.projectTitle,
        industrialPartner: formData.industrialPartner,
        projectContact: formData.projectContact || "",
        startDate: formData.startDate,
        endDate: formData.endDate || "",
        duration: formData.duration || "",
        partnerCash: formData.partnerCash || "",
        partnerInKind: formData.partnerInKind || "",
        funding: formData.funding || "",
        sourceFunding:
          formData.sourceFunding === "Other" ? formData.otherFundingSource : formData.sourceFunding,
        inlineSummary: formData.inlineSummary || "",
        briefSummary: formData.briefSummary || "",
        opportunity: formData.opportunity || "",
        problem: formData.problem || "",
        intervention: formData.intervention || "",
        results: formData.results || "",
        goToMarket: formData.goToMarket || "",
        increaseRevenue: formData.increaseRevenue || "",
        decreaseCosts: formData.decreaseCosts || "",
        hireEmployees: formData.hireEmployees || "",
        registerNewIntellectualProperty: formData.registerNewIntellectualProperty || "",
        export: formData.export || "",
        secureInvestment: formData.secureInvestment || "",
        increaseServices: formData.increaseServices || "",
        changeStrategy: formData.changeStrategy || "",
        improvedProductService: formData.improvedProductService || "",
        other: formData.other || "",
        newExpertise: formData.newExpertise || "",
        studentsHired: formData.studentsHired || "",
        referral: formData.referral || "",
        presentResults: formData.presentResults || "",
        mediaCoverage: formData.mediaCoverage || "",
        team: filteredTeam,
        tags: formData.tags || [],
        projectId: newProjectId,
        internalDetails: formData.internalDetails || "",
        partnerType: formData.partnerType || "",
        updatedAt: new Date().toISOString(),
        updatedBy: userFirstName,
      };

      console.log("Prepared report input for submission:", reportInput);

      const createdReportId = await createReport(reportInput);
      if (createdReportId) {
        toast.success(`Report submitted successfully! Project ID: ${createdReportId}`);
      } else {
        toast.error("Failed to create report.");
        setIsSubmitting(false);
        return;
      }

      if (imageFiles.length > 0) {
        const imageNames = imageFiles.map((file) => file.filename);
        const imageData = imageFiles.map((file) => file.base64Data);
        const uploadedImages = await createImage(newProjectId, imageNames, imageData);
        if (uploadedImages) {
          console.log("Uploaded images:", uploadedImages);
        }
      }

      toast.success("Report submitted successfully! Redirecting you to the homepage...");

      // give a timeout to show the success message
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);

    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitReport();
  };

  return (
    <div className={styles["main-container"]}>
      {/* PROGRESS BAR */}
      <ul className={styles.progressBar}>
        <li data-step="1" className={currentStep === 1 ? styles.active : ""}>Project Information</li>
        <li data-step="2" className={currentStep === 2 ? styles.active : ""}>Project Overview</li>
        <li data-step="3" className={currentStep === 3 ? styles.active : ""}>Internal Information</li>
        <li data-step="4" className={currentStep === 4 ? styles.active : ""}>Partner Impact</li>
        <li data-step="5" className={currentStep === 5 ? styles.active : ""}>Company Impact</li>
        <li data-step="6" className={currentStep === 6 ? styles.active : ""}>Team, Tags & Images</li>
      </ul>

      <div className={styles["content-container"]}>
        <div className={styles["flex-container"]}>
          <div className={styles["ReportPage"]}>
            <header className={styles["ReportPage-header"]}>
              <div className={styles["ReportPage"]}>
                <form onSubmit={handleSubmit}>
                  {/* STEP 1: PROJECT INFORMATION */}
                  {currentStep === 1 && (
                    <div className={`${styles.step} ${styles.step1}`}>
                      <h1>Project Information</h1>
                      <div className={styles.gridContainer}>
                        <div>
                          <label htmlFor="projectTitle">Project Title:</label>
                          <input
                            type="text"
                            id="projectTitle"
                            name="projectTitle"
                            placeholder="Project Title"
                            value={formData.projectTitle}
                            onChange={handleChange}
                            className={errors.projectTitle ? "error" : ""}
                          />
                          {errors.projectTitle && (
                            <div className={styles["error-message"]}>{errors.projectTitle}</div>
                          )}

                          <label htmlFor="industrialPartner"> Partner:</label>
                          <input
                            type="text"
                            id="industrialPartner"
                            name="industrialPartner"
                            placeholder=" Partner"
                            value={formData.industrialPartner}
                            onChange={handleChange}
                            className={errors.industrialPartner ? "error" : ""}
                          />
                          {errors.industrialPartner && (
                            <div className={styles["error-message"]}>{errors.industrialPartner}</div>
                          )}

                          <label htmlFor="projectContact">Project Contact:</label>
                          <select
                            id="projectContact"
                            name="projectContact"
                            value={formData.projectContact}
                            onChange={handleProjectContactChange}
                            className={`${styles.selectBox} ${errors.projectContact ? "error" : ""}`}
                          >
                            <option value="">Select Project Contact</option>
                            {teamMembers.map((tm: any) => (
                              <option key={tm.id} value={tm.name}>
                                {tm.name}
                              </option>
                            ))}
                            <option value="add_new">+ Add a Custom Project Contact</option>
                          </select>
                          {errors.projectContact && (
                            <div className={styles["error-message"]}>{errors.projectContact}</div>
                          )}
                          {newProjectContactVisible && (
                            <div className={styles["new-contact"]}>
                              <input
                                type="text"
                                placeholder="Enter new contact name"
                                value={newProjectContactValue}
                                onChange={(e) => setNewProjectContactValue(e.target.value)}
                              />
                              <button type="button" onClick={saveNewProjectContact}>
                                Save
                              </button>
                              <button type="button" onClick={() => { setNewProjectContactVisible(false); setNewProjectContactValue(""); }}>
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="projectType">Project Type</label>
                          <select
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            className={errors.projectType ? "error" : ""}
                          >
                            <option value="">Select Project Type</option>
                            <option value="External">External</option>
                            <option value="Internal">Internal</option>
                          </select>
                          {errors.projectType && (
                            <div className={styles["error-message"]}>{errors.projectType}</div>
                          )}

                          <label htmlFor="partnerType">Partner Type</label>
                          <select
                            name="partnerType"
                            value={formData.partnerType}
                            onChange={handleChange}
                          >
                            <option value="">Select Partner Type</option>
                            <option value="Industry">SME</option>
                            <option value="Academic">Academic</option>
                            <option value="Large-Company">Large Company</option>
                            <option value="Not-For-Profit">Not-For-Profit</option>
                            <option value="Community">Community</option>
                          </select>

                          <label htmlFor="startDate">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            placeholder="Start Date"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={errors.startDate ? "error" : ""}
                          />
                          {errors.startDate && (
                            <div className={styles["error-message"]}>{errors.startDate}</div>
                          )}

                          <label htmlFor="endDate">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            placeholder="End Date"
                            value={formData.endDate}
                            onChange={handleChange}
                          />

                          <label htmlFor="duration">Duration</label>
                          <input
                            type="text"
                            placeholder="Calculated automatically based on start and end dates."
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            readOnly
                          />

                          <label htmlFor="sourceFunding">Source of Funding</label>
                          <select
                            id="sourceFunding"
                            name="sourceFunding"
                            value={formData.sourceFunding}
                            onChange={handleChange}
                            className={errors.sourceFunding ? "error" : ""}
                          >
                            <option value="">Select Funding Source</option>
                            <option value="NRC">NRC</option>
                            <option value="NSERC">NSERC</option>
                            <option value="OCI">OCI</option>
                            <option value="NRCan">NRCan</option>
                            <option value="NRC-IRAP">NRC-IRAP</option>
                            <option value="Fee-for-Service">Fee-for-Service</option>
                            <option value="IESO">IESO</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.sourceFunding && (
                            <div className={styles["error-message"]}>{errors.sourceFunding}</div>
                          )}
                          {formData.sourceFunding === "Other" && (
                            <>
                              <label htmlFor="otherFundingSource">
                                Please specify the funding source:
                              </label>
                              <input
                                type="text"
                                id="otherFundingSource"
                                name="otherFundingSource"
                                placeholder="Enter funding source"
                                value={formData.otherFundingSource}
                                onChange={handleChange}
                                className={errors.otherFundingSource ? "error" : ""}
                              />
                              {errors.otherFundingSource && (
                                <div className={styles["error-message"]}>
                                  {errors.otherFundingSource}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* SUBMIT EARLY BUTTON */}
                      <div className={`${styles["step-navigation"]} ${styles.step1}`}>
                        <button
                          type="button"
                          onClick={handleSubmitEarly}
                          className={styles.submitEarlyButton}
                        >
                          Submit Early
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className={styles.formButton}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PROJECT OVERVIEW */}
                  {currentStep === 2 && (
                    <div className={`${styles.step} ${styles.step2}`}>
                      <h1>Project Overview</h1>
                      <label htmlFor="inlineSummary">Brief Summary</label>
                      <ReactQuill
                        placeholder="Write a one or two sentence summary of the project."
                        value={formData.inlineSummary}
                        onChange={(content) => handleChangeRichText("inlineSummary", content)}
                      />
                      <label htmlFor="opportunity">Opportunity</label>
                      <ReactQuill
                        placeholder="Describe the market opportunity."
                        value={formData.opportunity}
                        onChange={(content) => handleChangeRichText("opportunity", content)}
                      />
                      <label htmlFor="problem">Problem</label>
                      <ReactQuill
                        placeholder="Describe the problem encountered."
                        value={formData.problem}
                        onChange={(content) => handleChangeRichText("problem", content)}
                      />
                      <label htmlFor="intervention">Intervention</label>
                      <ReactQuill
                        placeholder="What did you do?"
                        value={formData.intervention}
                        onChange={(content) => handleChangeRichText("intervention", content)}
                      />
                      <label htmlFor="results">Results</label>
                      <ReactQuill
                        placeholder="Describe key results and outcomes."
                        value={formData.results}
                        onChange={(content) => handleChangeRichText("results", content)}
                      />
                      <div className={styles["step-navigation"]}>
                        <button type="button" onClick={handlePreviousStep} className={styles.formButton}>
                          Back
                        </button>
                        <button type="button" onClick={handleNextStep} className={styles.formButton}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: INTERNAL-USE ONLY DETAILS */}
                  {currentStep === 3 && (
                    <div className={`${styles.step} ${styles.step3}`}>
                      <h1>Internal-use Only</h1>
                      <label htmlFor="partnerCash">Partner Cash Contribution</label>
                      <input
                        type="text"
                        name="partnerCash"
                        placeholder="Enter Partner Cash Contribution"
                        value={formData.partnerCash}
                        onChange={handleChange}
                      />
                      <label htmlFor="partnerInKind">Partner In-Kind Contribution</label>
                      <input
                        type="text"
                        name="partnerInKind"
                        placeholder="Enter Partner In-Kind Contribution"
                        value={formData.partnerInKind}
                        onChange={handleChange}
                      />
                      <label htmlFor="funding">Funding Amount</label>
                      <input
                        type="text"
                        name="funding"
                        placeholder="Enter Funding Amount"
                        value={formData.funding}
                        onChange={handleChange}
                      />
                      <label htmlFor="internalDetails">Internal Details</label>
                      <ReactQuill
                        placeholder="Enter internal details..."
                        value={formData.internalDetails}
                        onChange={(content) => handleChangeRichText("internalDetails", content)}
                      />
                      <div className={styles["step-navigation"]}>
                        <button type="button" onClick={handlePreviousStep} className={styles.formButton}>
                          Back
                        </button>
                        <button type="button" onClick={handleNextStep} className={styles.formButton}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PARTNER IMPACT */}
                  {currentStep === 4 && (
                    <div className={`${styles.step} ${styles.step4}`}>
                      <h1>Partner Impact</h1>
                      <label htmlFor="goToMarket">Go To Market</label>
                      <ReactQuill
                        placeholder="Describe your go-to-market strategy."
                        value={formData.goToMarket}
                        onChange={(content) => handleChangeRichText("goToMarket", content)}
                      />
                      <label htmlFor="increaseRevenue">Increase Revenue</label>
                      <ReactQuill
                        placeholder="Explain how the project increased revenue."
                        value={formData.increaseRevenue}
                        onChange={(content) => handleChangeRichText("increaseRevenue", content)}
                      />
                      <label htmlFor="decreaseCosts">Decrease Costs</label>
                      <ReactQuill
                        placeholder="Describe how costs were decreased."
                        value={formData.decreaseCosts}
                        onChange={(content) => handleChangeRichText("decreaseCosts", content)}
                      />
                      <label htmlFor="hireEmployees">Hire Employees</label>
                      <ReactQuill
                        placeholder="Details on hiring new staff."
                        value={formData.hireEmployees}
                        onChange={(content) => handleChangeRichText("hireEmployees", content)}
                      />
                      <label htmlFor="registerNewIntellectualProperty">
                        Register New Intellectual Property
                      </label>
                      <ReactQuill
                        placeholder="Details on registering new intellectual property."
                        value={formData.registerNewIntellectualProperty}
                        onChange={(content) =>
                          handleChangeRichText("registerNewIntellectualProperty", content)
                        }
                      />
                      <label htmlFor="export">Export</label>
                      <ReactQuill
                        placeholder="Describe export strategies."
                        value={formData.export}
                        onChange={(content) => handleChangeRichText("export", content)}
                      />
                      <label htmlFor="secureInvestment">Secure Investment</label>
                      <ReactQuill
                        placeholder="Describe how investment was secured."
                        value={formData.secureInvestment}
                        onChange={(content) => handleChangeRichText("secureInvestment", content)}
                      />
                      <label htmlFor="increaseServices">Increase Services</label>
                      <ReactQuill
                        placeholder="How did services expand?"
                        value={formData.increaseServices}
                        onChange={(content) => handleChangeRichText("increaseServices", content)}
                      />
                      <label htmlFor="changeStrategy">Change Strategy</label>
                      <ReactQuill
                        placeholder="Describe any strategic shifts."
                        value={formData.changeStrategy}
                        onChange={(content) => handleChangeRichText("changeStrategy", content)}
                      />
                      <label htmlFor="improvedProductService">Improved Product/Service</label>
                      <ReactQuill
                        placeholder="Explain product/service improvements."
                        value={formData.improvedProductService}
                        onChange={(content) => handleChangeRichText("improvedProductService", content)}
                      />
                      <label htmlFor="other">Other</label>
                      <ReactQuill
                        placeholder="Additional relevant information."
                        value={formData.other}
                        onChange={(content) => handleChangeRichText("other", content)}
                      />
                      <div className={styles["step-navigation"]}>
                        <button type="button" onClick={handlePreviousStep} className={styles.formButton}>
                          Back
                        </button>
                        <button type="button" onClick={handleNextStep} className={styles.formButton}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Company IMPACT */}
                  {currentStep === 5 && (
                    <div className={`${styles.step} ${styles.step5}`}>
                      <h1>Company Impact</h1>
                      <label htmlFor="newExpertise">New Expertise</label>
                      <ReactQuill
                        placeholder="Detail new expertise acquired"
                        value={formData.newExpertise}
                        onChange={(content) => handleChangeRichText("newExpertise", content)}
                      />
                      <label htmlFor="studentsHired">Students Hired</label>
                      <ReactQuill
                        placeholder="Details on student hiring or internships"
                        value={formData.studentsHired}
                        onChange={(content) => handleChangeRichText("studentsHired", content)}
                      />
                      <label htmlFor="referral">Referral</label>
                      <ReactQuill
                        placeholder="Explain referral programs or sources"
                        value={formData.referral}
                        onChange={(content) => handleChangeRichText("referral", content)}
                      />
                      <label htmlFor="presentResults">Present Results</label>
                      <ReactQuill
                        placeholder="Summarize the project results"
                        value={formData.presentResults}
                        onChange={(content) => handleChangeRichText("presentResults", content)}
                      />
                      <label htmlFor="mediaCoverage">Media Coverage</label>
                      <ReactQuill
                        placeholder="Detail any media coverage received"
                        value={formData.mediaCoverage}
                        onChange={(content) => handleChangeRichText("mediaCoverage", content)}
                      />
                      <div className={styles["step-navigation"]}>
                        <button type="button" onClick={handlePreviousStep} className={styles.formButton}>
                          Back
                        </button>
                        <button type="button" onClick={handleNextStep} className={styles.formButton}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: TEAM, TAGS & IMAGES */}
                  {currentStep === 6 && (
                    <div className={`${styles.step} ${styles.step6}`}>
                      <h1>Team, Tags & Images</h1>
                      {/* TEAM SECTION */}
                      <h2>Team</h2>
                      <div className={`${styles["team-section"]} ${errors.team ? styles.error : ""}`}>
                        {formData.team.map((member, index) => {
                          const teamId = `team-${index}-name`;
                          const expertiseId = `team-${index}-expertise`;
                          return (
                            <div key={index} className={styles["team-member-container"]}>
                              <div className={styles["input-group"]}>
                                <label htmlFor={teamId}>Team Member #{index + 1}</label>
                                <select
                                  id={teamId}
                                  data-id={index}
                                  value={member.name}
                                  className={`${styles["team-member-name"]} ${styles.selectBox}`}
                                  onChange={(e) => handleTeamMemberChange(e, index)}
                                  name={`team[${index}].name`}
                                >
                                  <option value="">Select Team Member</option>
                                  {teamMembers.map((tm: any) => (
                                    <option key={tm.id} value={tm.name}>
                                      {tm.name}
                                    </option>
                                  ))}
                                  <option value="add_new">+ Add New Team Member</option>
                                </select>
                              </div>
                              {/* If the user selected "add_new", show inline input */}
                              {newTeamMemberValues.hasOwnProperty(index) && (
                                <div className={styles["new-contact"]}>
                                  <input
                                    type="text"
                                    placeholder="Enter new team member name"
                                    value={newTeamMemberValues[index]}
                                    onChange={(e) => handleNewTeamMemberChange(index, e.target.value)}
                                  />
                                  <button type="button" onClick={() => saveNewTeamMember(index)}>
                                    Save
                                  </button>
                                  <button type="button" onClick={() => cancelNewTeamMember(index)}>
                                    Cancel
                                  </button>
                                </div>
                              )}
                              <div className={styles["input-group"]}>
                                <label htmlFor={expertiseId}>Expertise Applied</label>
                                <input
                                  type="text"
                                  name={`team[${index}].expertise`}
                                  data-id={index}
                                  id={expertiseId}
                                  value={member.expertise}
                                  className={styles.expertise}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {errors.team && (
                        <div className={styles["error-message"]}>{errors.team}</div>
                      )}

                      {/* TAGS SECTION */}
                      <h2>Tags</h2>
                      <div className={styles["tags-input-container"]}>
                        <input
                          type="text"
                          name="currentTag"
                          placeholder="Add a tag"
                          value={formData.currentTag}
                          onChange={handleTagChange}
                          className={errors.tags ? "error" : ""}
                        />
                        <button onClick={addTag}>Add Tag</button>
                        {tagSuggestions.length > 0 && (
                          <ul className={styles["tag-suggestions"]}>
                            {tagSuggestions.map((suggestion, index) => (
                              <li key={index} onClick={() => selectTagSuggestion(suggestion)}>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className={styles["tags-container"]}>
                        {formData.tags.map((tag, index) => (
                          <div key={index} className={styles.tag}>
                            {tag}
                            <button type="button" onClick={() => removeTag(index)} className={styles["remove-tag"]}>
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      {errors.tags && (
                        <div className={styles["error-message"]}>{errors.tags}</div>
                      )}

                      {/* IMAGE UPLOAD SECTION */}
                      <h2>Image Upload</h2>
                      <div
                        className={styles["image-drop-area"]}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDrop={handleImageDrop}
                      >
                        Drag and drop images here
                        <input
                          type="file"
                          id="imageUpload"
                          name="imageUpload"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                          multiple
                        />
                        <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                          <FontAwesomeIcon icon={faUpload} size="3x" style={{ margin: "10px" }} />
                        </label>
                      </div>
                      <div className={styles["image-files-container"]}>
                        {imageFiles.map((file, index) => (
                          <div key={index} className={styles["image-file"]}>
                            <span>{file.filename}</span>
                            <button type="button" onClick={() => removeFile(index)}>
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className={styles["step-navigation"]}>
                        <button type="button" onClick={handlePreviousStep} className={styles.formButton}>
                          Back
                        </button>
                        <button type="submit" disabled={isSubmitting} className={styles.formButton}>
                          {isSubmitting ? "Submitting..." : "Submit Report"}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
