// src/components/EditReportModal.tsx
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faImage } from "@fortawesome/free-solid-svg-icons";


import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

// Import our type‑safe data calls
import { updateReport } from "../dataCalls/updateReport";
import { createImage } from "../dataCalls/createImage";
import { createStaffList } from "../dataCalls/createStaffList";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

import styles from "../styles/EditReportModal.module.scss";

import { ImageFileProps } from "../types/ImageFileProps";
import { ReportFormData } from "../types/ReportFormData";
import { TeamMember } from "../types/TeamMember";
import { EditReportProps } from "../types/EditReportProps";

type ImageFile = ImageFileProps;

/**
 * EditReportModal component allows users to edit an existing report through a multi-step form.
 * 
 * @component
 * @param {EditReportProps} props - The props for the EditReportModal component.
 * @param {ReportFormData} props.report - The initial report data to populate the form.
 * @param {() => void} props.onClose - Function to close the modal.
 * 
 * @returns {JSX.Element} The rendered EditReportModal component.
 * 
 * @example
 * <EditReportModal report={reportData} onClose={handleClose} />
 * 
 * @remarks
 * The form is divided into six steps:
 * 1. Project Information
 * 2. Project Overview
 * 3. Internal Details
 * 4. Partner Impact
 * 5. Company Impact
 * 6. Team, Tags & Images
 * 
 * The component handles form state, validation, and submission. It also supports adding new project contacts and team members inline.
 * 
 * @function handleNextStep - Advances to the next step in the form.
 * @function handlePreviousStep - Goes back to the previous step in the form.
 * @function handleChange - Handles changes to standard input fields.
 * @function handleChangeRichText - Handles changes to rich text fields.
 * @function handleProjectContactChange - Handles changes to the project contact select field.
 * @function saveNewProjectContact - Saves a new project contact.
 * @function handleTeamMemberChange - Handles changes to team member select fields.
 * @function handleNewTeamMemberChange - Handles changes to new team member input fields.
 * @function saveNewTeamMember - Saves a new team member.
 * @function cancelNewTeamMember - Cancels the addition of a new team member.
 * @function handleTagChange - Handles changes to the tag input field.
 * @function selectTagSuggestion - Selects a tag suggestion.
 * @function addTag - Adds a new tag.
 * @function removeTag - Removes a tag.
 * @function ensureTagExists - Ensures a tag exists in the database.
 * @function handleImageChange - Handles changes to the image input field.
 * @function removeFile - Removes an image file.
 * @function handleImageDrop - Handles image file drops.
 * @function processFiles - Processes image files.
 * @function validate - Validates the entire form.
 * @function validateStep1 - Validates the first step of the form.
 * @function handleSubmitEarly - Handles early submission of the form.
 * @function submitReport - Submits the report.
 * @function handleSubmit - Handles form submission.
 */
const EditReportModal: React.FC<EditReportProps> = ({ report, onClose }) => {
  // Multi‑step navigation state (steps 1–6)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePreviousStep = () => setCurrentStep((prev) => prev - 1);

  // Local form state; initialize from the passed report.
  const [formData, setFormData] = useState<ReportFormData>(report);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  //  For inline new Project Contact input
  const [newProjectContactVisible, setNewProjectContactVisible] = useState<boolean>(false);
  const [newProjectContactValue, setNewProjectContactValue] = useState<string>("");

  //  For inline new Team Member input (by index)
  const [newTeamMemberValues, setNewTeamMemberValues] = useState<{ [key: number]: string }>({});

  // Fetch team members and tags on mount
  useEffect(() => {
    const fetchStaffAndTags = async () => {
      try {
        // Fetch staff for team member selects
        const staffRes: any = await API.graphql(
          graphqlOperation(/* Replace with your staff list query */ queries.listStaffList)
        );
        const staffList = staffRes.data?.listStaffList || [];
        setTeamMembers(staffList);
        // Fetch tags
        const tagRes: any = await API.graphql(graphqlOperation(queries.listTagList));
        const tagsFromDb = tagRes.data?.listTagList || tagRes.data?.listTags || [];
        const mappedTags = [
          ...new Set(tagsFromDb.map((t: any) => t.tagName || t.name))
        ].filter((tag) => typeof tag === "string" && tag.trim() !== "");
        setAllTags(mappedTags as string[]);
      } catch (error) {
        console.error("Error fetching staff/tags:", error);
        toast.error("Failed to load staff and tags");
      }
    };
    fetchStaffAndTags();
  }, []);

  // Handler for standard input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const teamRegex = /^team\[(\d+)\]\.(name|expertise)$/; // Matches team[0].name, team[1].expertise, etc.
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
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)); // Difference in days
            return { ...prev, duration: `${diff} days` };
          } else {
            return { ...prev, duration: "" };
          }
        }
        return prev;
      });
    }
  };

  // Handler for rich text changes
  const handleChangeRichText = (name: keyof ReportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for project contact select
  const handleProjectContactChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === "add_new") {
      setNewProjectContactVisible(true);
    } else {
      setFormData((prev) => ({ ...prev, projectContact: value }));
      setNewProjectContactVisible(false);
    }
  };

  const saveNewProjectContact = async () => {
    if (!newProjectContactValue.trim()) {
      toast.error("Please enter a valid name.");
      return;
    }
    try {
      const newStaff = await createStaffList({
        name: newProjectContactValue.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: "",
      });
      if (newStaff) {
        setFormData((prev) => ({ ...prev, projectContact: newStaff.name }));
        toast.success(`Project Contact ${newStaff.name} added successfully`);
        setNewProjectContactVisible(false);
        setNewProjectContactValue("");
      }
    } catch (error) {
      console.error("Error adding new project contact:", error);
      toast.error("Failed to add new project contact.");
    }
  };

  // Handler for inline team member select
  const handleTeamMemberChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = event.target;
    if (name === "name" && value === "add_new") {
      setNewTeamMemberValues((prev) => ({ ...prev, [index]: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        team: prev.team.map((member, idx) =>
          idx === index ? { ...member, [name]: value } : member
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
      const newStaff = await createStaffList({
        name: newName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: "",
      });
      if (newStaff) {
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
      }
    } catch (error) {
      console.error("Error creating team member:", error);
      toast.error("Failed to add team member.");
    }
  };

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

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFormData((prev) => ({ ...prev, currentTag: newValue }));
    const suggestions = allTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(newValue.toLowerCase()) &&
          !formData.tags.includes(tag)
      )
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
    const updatedTags = formData.tags.filter((_, index) => index !== indexToRemove);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const ensureTagExists = async (tagName: string) => {
    try {
      const exists = allTags.some(
        (tag) => tag.toLowerCase() === tagName.toLowerCase()
      );
      if (!exists && tagName) {
        const createInput = {
          tagName: tagName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const result: any = await API.graphql(
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

  // Image Handlers
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileReaders = files.map((file) =>
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
    const files = event.dataTransfer.items
      ? Array.from(event.dataTransfer.items)
          .filter((item) => item.kind === "file")
          .map((item) => item.getAsFile())
          .filter((file): file is File => file !== null)
      : Array.from(event.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const fileReaders = files.map((file) =>
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

  // FULL FORM VALIDATION
  const validate = (): Record<string, string> => {
    let newErrors: Record<string, string> = {};
    if (!formData.projectTitle) newErrors.projectTitle = "Project Title is required";
    if (!formData.industrialPartner)
      newErrors.industrialPartner = " Partner is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.projectType) newErrors.projectType = "Project Type is required";
    if (formData.tags.length === 0) newErrors.tags = "At least one tag is required";
    if (formData.sourceFunding === "Other" && !formData.otherFundingSource) {
      newErrors.otherFundingSource = "Please specify the funding source";
    }
    return newErrors;
  };

  // STEP 1 VALIDATION: Check required fields including Project Contact and Source Funding
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

  // HANDLE SUBMIT EARLY: Validate Step 1; if valid, go directly to Step 6 (Team, Tags & Images)
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

  // SUBMIT FUNCTION: On form submit, validate and then update the report.
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
      const userData: any = await API.graphql(graphqlOperation(queries.getUser, { id: username }));
      const userEmail = userData.data.getUser.email;
      const userFirstName = userEmail
        .slice(0, userEmail.search(/[-.]/))
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

      const updatedInput = {
        id: formData.id,
        projectType: formData.projectType,
        projectTitle: formData.projectTitle,
        industrialPartner: formData.industrialPartner,
        projectContact: formData.projectContact,
        startDate: formData.startDate,
        endDate: formData.endDate || '',
        duration: formData.duration || '',
        partnerCash: formData.partnerCash || '',
        partnerInKind: formData.partnerInKind || '',
        funding: formData.funding || '',
        sourceFunding: formData.sourceFunding === "Other" ? formData.otherFundingSource : formData.sourceFunding,
        inlineSummary: formData.inlineSummary || '',
        briefSummary: formData.briefSummary || '',
        opportunity: formData.opportunity || '',
        problem: formData.problem || '',
        intervention: formData.intervention || '',
        results: formData.results || '',
        goToMarket: formData.goToMarket || '',
        increaseRevenue: formData.increaseRevenue || '',
        decreaseCosts: formData.decreaseCosts || '',
        hireEmployees: formData.hireEmployees || '',
        registerNewIntellectualProperty: formData.registerNewIntellectualProperty || '',
        export: formData.export || '',
        secureInvestment: formData.secureInvestment || '',
        increaseServices: formData.increaseServices || '',
        changeStrategy: formData.changeStrategy || '',
        improvedProductService: formData.improvedProductService || '',
        other: formData.other || '',
        newExpertise: formData.newExpertise || '',
        studentsHired: formData.studentsHired || '',
        referral: formData.referral || '',
        presentResults: formData.presentResults || '',
        mediaCoverage: formData.mediaCoverage || '',
        team: formData.team.map((member) => ({
          name: member.name,
          expertise: member.expertise,
        })),
        tags: formData.tags || [],
        internalDetails: formData.internalDetails || '',
        partnerType: formData.partnerType || '',
        updatedAt: new Date().toISOString(),
        updatedBy: userFirstName,
      };

      console.log("Prepared report input for update:", updatedInput);

      const updatedReportId = await updateReport(updatedInput);
      if (updatedReportId) {
        toast.success(`Report updated successfully! Project ID: ${updatedReportId}`);
      } else {
        toast.error("Failed to update report.");
        setIsSubmitting(false);
        return;
      }

      if (imageFiles.length > 0) {
        const imageNames = imageFiles.map((file) => file.filename);
        const imageData = imageFiles.map((file) => file.base64Data);
        const uploadedImages = await createImage(formData.projectTitle, imageNames, imageData);
        if (uploadedImages) {
          console.log("Uploaded images:", uploadedImages);
        }
      }

      onClose();
    } catch (error: any) {
      console.error("Error during update:", error);
      toast.error(`Error updating report: ${error.message || "An unexpected error occurred."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitReport();
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h1>Edit Report</h1>
        <form onSubmit={handleSubmit}>
          {/* STEP 1: PROJECT INFORMATION */}
          {currentStep === 1 && (
            <div className={`${styles.step} ${styles.step1}`}>
              <h2>Project Information</h2>
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
                    className={errors.projectTitle ? styles.error : ""}
                  />
                  {errors.projectTitle && <div className={styles.errorMessage}>{errors.projectTitle}</div>}
                  
                  <label htmlFor="industrialPartner"> Partner:</label>
                  <input
                    type="text"
                    id="industrialPartner"
                    name="industrialPartner"
                    placeholder=" Partner"
                    value={formData.industrialPartner}
                    onChange={handleChange}
                    className={errors.industrialPartner ? styles.error : ""}
                  />
                  {errors.industrialPartner && <div className={styles.errorMessage}>{errors.industrialPartner}</div>}
                  
                  <label htmlFor="projectContact">Project Contact:</label>
                  <select
                    id="projectContact"
                    name="projectContact"
                    value={formData.projectContact}
                    onChange={handleProjectContactChange}
                    className={`${styles.selectBox} ${errors.projectContact ? styles.error : ""}`}
                  >
                    <option value="">Select Project Contact</option>
                    {teamMembers.map((tm: any) => (
                      <option key={tm.id} value={tm.name}>
                        {tm.name}
                      </option>
                    ))}
                    <option value="add_new">+ Add a Custom Project Contact</option>
                  </select>
                  {errors.projectContact && <div className={styles.errorMessage}>{errors.projectContact}</div>}
                  {newProjectContactVisible && (
                    <div className={styles.newContact}>
                      <input
                        type="text"
                        placeholder="Enter new contact name"
                        value={newProjectContactValue}
                        onChange={(e) => setNewProjectContactValue(e.target.value)}
                      />
                      <button type="button" onClick={saveNewProjectContact}>Save</button>
                      <button type="button" onClick={() => { setNewProjectContactVisible(false); setNewProjectContactValue(""); }}>Cancel</button>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="projectType">Project Type:</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={errors.projectType ? styles.error : ""}
                  >
                    <option value="">Select Project Type</option>
                    <option value="External">External</option>
                    <option value="Internal">Internal</option>
                  </select>
                  {errors.projectType && <div className={styles.errorMessage}>{errors.projectType}</div>}
                  
                  <label htmlFor="partnerType">Partner Type:</label>
                  <select name="partnerType" value={formData.partnerType} onChange={handleChange}>
                    <option value="">Select Partner Type</option>
                    <option value="Industry">SME</option>
                    <option value="Academic">Academic</option>
                    <option value="Large-Company">Large Company</option>
                    <option value="Not-For-Profit">Not-For-Profit</option>
                    <option value="Community">Community</option>
                  </select>
                  
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? styles.error : ""}
                  />
                  {errors.startDate && <div className={styles.errorMessage}>{errors.startDate}</div>}
                  
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                  
                  <label htmlFor="duration">Duration:</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="Calculated automatically"
                    value={formData.duration}
                    onChange={handleChange}
                    readOnly
                  />
                  
                  <label htmlFor="sourceFunding">Source of Funding:</label>
                  <select
                    id="sourceFunding"
                    name="sourceFunding"
                    value={formData.sourceFunding}
                    onChange={handleChange}
                    className={errors.sourceFunding ? styles.error : ""}
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
                  {errors.sourceFunding && <div className={styles.errorMessage}>{errors.sourceFunding}</div>}
                  {formData.sourceFunding === "Other" && (
                    <>
                      <label htmlFor="otherFundingSource">Please specify the funding source:</label>
                      <input
                        type="text"
                        id="otherFundingSource"
                        name="otherFundingSource"
                        placeholder="Enter funding source"
                        value={formData.otherFundingSource}
                        onChange={handleChange}
                        className={errors.otherFundingSource ? styles.error : ""}
                      />
                      {errors.otherFundingSource && <div className={styles.errorMessage}>{errors.otherFundingSource}</div>}
                    </>
                  )}
                </div>
              </div>
              <div className={styles.stepNavigation}>
                <button type="button" onClick={handleSubmitEarly} className={styles.exitEarly}>
                  Save & Exit Early
                </button>
                <button type="button" onClick={handleNextStep} className={styles.formButton}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROJECT OVERVIEW */}
          {currentStep === 2 && (
            <div className={`${styles.step} ${styles.step2}`}>
              <h2>Project Overview</h2>
              <label htmlFor="inlineSummary">Brief Summary</label>
              <ReactQuill
                theme="snow"
                placeholder="Write a one or two sentence summary of the project."
                value={formData.inlineSummary}
                onChange={(content) => handleChangeRichText("inlineSummary", content)}
              />
              <label htmlFor="opportunity">Opportunity</label>
              <ReactQuill
                theme="snow"
                placeholder="Describe the market opportunity."
                value={formData.opportunity}
                onChange={(content) => handleChangeRichText("opportunity", content)}
              />
              <label htmlFor="problem">Problem</label>
              <ReactQuill
                theme="snow"
                placeholder="Describe the problem encountered."
                value={formData.problem}
                onChange={(content) => handleChangeRichText("problem", content)}
              />
              <label htmlFor="intervention">Intervention</label>
              <ReactQuill
                theme="snow"
                placeholder="What did you do?"
                value={formData.intervention}
                onChange={(content) => handleChangeRichText("intervention", content)}
              />
              <label htmlFor="results">Results</label>
              <ReactQuill
                theme="snow"
                placeholder="Describe key results and outcomes."
                value={formData.results}
                onChange={(content) => handleChangeRichText("results", content)}
              />
              <div className={styles.stepNavigation}>
                <button type="button" onClick={handlePreviousStep} className={styles.formButton}>Back</button>
                <button type="button" onClick={handleNextStep} className={styles.formButton}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 3: INTERNAL DETAILS */}
          {currentStep === 3 && (
            <div className={`${styles.step} ${styles.step3}`}>
              <h2>Internal Details</h2>
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
                theme="snow"
                placeholder="Enter internal details..."
                value={formData.internalDetails}
                onChange={(content) => handleChangeRichText("internalDetails", content)}
              />
              <div className={styles.stepNavigation}>
                <button type="button" onClick={handlePreviousStep} className={styles.formButton}>Back</button>
                <button type="button" onClick={handleNextStep} className={styles.formButton}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 4: PARTNER IMPACT */}
          {currentStep === 4 && (
            <div className={`${styles.step} ${styles.step4}`}>
              <h2>Partner Impact</h2>
              <label htmlFor="goToMarket">Go To Market</label>
              <ReactQuill
                theme="snow"
                placeholder="Describe your go-to-market strategy."
                value={formData.goToMarket}
                onChange={(content) => handleChangeRichText("goToMarket", content)}
              />
              <label htmlFor="increaseRevenue">Increase Revenue</label>
              <ReactQuill
                theme="snow"
                placeholder="Explain how the project increased revenue."
                value={formData.increaseRevenue}
                onChange={(content) => handleChangeRichText("increaseRevenue", content)}
              />
              <label htmlFor="decreaseCosts">Decrease Costs</label>
              <ReactQuill
                theme="snow"
                placeholder="Describe how costs were decreased."
                value={formData.decreaseCosts}
                onChange={(content) => handleChangeRichText("decreaseCosts", content)}
              />
              <label htmlFor="hireEmployees">Hire Employees</label>
              <ReactQuill
                theme="snow"
                placeholder="Details on hiring new staff."
                value={formData.hireEmployees}
                onChange={(content) => handleChangeRichText("hireEmployees", content)}
              />
              <label htmlFor="registerNewIntellectualProperty">Register New Intellectual Property</label>
              <ReactQuill
                theme="snow"
                placeholder="Specify any new patents or trademarks registered."
                value={formData.registerNewIntellectualProperty}
                onChange={(content) => handleChangeRichText("registerNewIntellectualProperty", content)}
              />
              <label htmlFor="export">Export</label>
              <ReactQuill
                theme="snow"
                placeholder="Describe export strategies."
                value={formData.export}
                onChange={(content) => handleChangeRichText("export", content)}
              />
              <label htmlFor="secureInvestment">Secure Investment</label>
              <ReactQuill
                theme="snow"
                placeholder="Explain how investment was secured."
                value={formData.secureInvestment}
                onChange={(content) => handleChangeRichText("secureInvestment", content)}
              />
              <label htmlFor="increaseServices">Increase Services</label>
              <ReactQuill
                theme="snow"
                placeholder="Detail the expansion or enhancement of services offered."
                value={formData.increaseServices}
                onChange={(content) => handleChangeRichText("increaseServices", content)}
              />
              <label htmlFor="changeStrategy">Change Strategy</label>
              <ReactQuill
                theme="snow"
                placeholder="Describe any strategic shifts."
                value={formData.changeStrategy}
                onChange={(content) => handleChangeRichText("changeStrategy", content)}
              />
              <label htmlFor="improvedProductService">Improved Product/Service</label>
              <ReactQuill
                theme="snow"
                placeholder="Explain enhancements made to products or services."
                value={formData.improvedProductService}
                onChange={(content) => handleChangeRichText("improvedProductService", content)}
              />
              <label htmlFor="other">Other</label>
              <ReactQuill
                theme="snow"
                placeholder="Additional relevant information."
                value={formData.other}
                onChange={(content) => handleChangeRichText("other", content)}
              />
              <div className={styles.stepNavigation}>
                <button type="button" onClick={handlePreviousStep} className={styles.formButton}>Back</button>
                <button type="button" onClick={handleNextStep} className={styles.formButton}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 5: Company IMPACT */}
          {currentStep === 5 && (
            <div className={`${styles.step} ${styles.step5}`}>
              <h2>Company Impact</h2>
              <label htmlFor="newExpertise">New Expertise</label>
              <ReactQuill
                theme="snow"
                placeholder="Detail new expertise acquired"
                value={formData.newExpertise}
                onChange={(content) => handleChangeRichText("newExpertise", content)}
              />
              <label htmlFor="studentsHired">Students Hired</label>
              <ReactQuill
                theme="snow"
                placeholder="Provide information on student employment or internships"
                value={formData.studentsHired}
                onChange={(content) => handleChangeRichText("studentsHired", content)}
              />
              <label htmlFor="referral">Referral</label>
              <ReactQuill
                theme="snow"
                placeholder="Explain referral programs or sources of referrals"
                value={formData.referral}
                onChange={(content) => handleChangeRichText("referral", content)}
              />
              <label htmlFor="presentResults">Present Results</label>
              <ReactQuill
                theme="snow"
                placeholder="Summarize key results and outcomes"
                value={formData.presentResults}
                onChange={(content) => handleChangeRichText("presentResults", content)}
              />
              <label htmlFor="mediaCoverage">Media Coverage</label>
              <ReactQuill
                theme="snow"
                placeholder="Detail any media coverage received"
                value={formData.mediaCoverage}
                onChange={(content) => handleChangeRichText("mediaCoverage", content)}
              />
              <div className={styles.stepNavigation}>
                <button type="button" onClick={handlePreviousStep} className={styles.formButton}>Back</button>
                <button type="button" onClick={handleNextStep} className={styles.formButton}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 6: TEAM, TAGS & IMAGES */}
          {currentStep === 6 && (
            <div className={`${styles.step} ${styles.step6}`}>
              <h2>Team, Tags & Images</h2>
              {/* TEAM SECTION */}
              <h3>Team</h3>
              <div className={`${styles.teamSection} ${errors.team ? styles.error : ""}`}>
                {formData.team.map((member, index) => {
                  const teamId = `team-${index}-name`;
                  const expertiseId = `team-${index}-expertise`;
                  return (
                    <div key={index} className={styles.teamMemberContainer}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={teamId}>Team Member #{index + 1}</label>
                        <select
                          id={teamId}
                          data-id={index}
                          name="name"
                          value={member.name || ""}
                          className={`${styles.teamMemberName} ${styles.selectBox}`}
                          onChange={(e) => handleTeamMemberChange(e, index)}
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
                      {newTeamMemberValues.hasOwnProperty(index) && (
                        <div className={styles.newContact}>
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
                      <div className={styles.inputGroup}>
                        <label htmlFor={expertiseId}>Expertise Applied</label>
                        <input
                          type="text"
                          name="expertise"
                          data-id={index}
                          id={expertiseId}
                          value={member.expertise || ""}
                          className={styles.expertise}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.team && <div className={styles.errorMessage}>{errors.team}</div>}
              {/* TAGS SECTION */}
              <h3>Tags</h3>
              <div className={styles.tagsInputContainer}>
                <input
                  type="text"
                  name="currentTag"
                  placeholder="Add a tag"
                  value={formData.currentTag || ""}
                  onChange={handleTagChange}
                  className={errors.tags ? styles.error : ""}
                />
                <button onClick={addTag}>Add Tag</button>
                {tagSuggestions.length > 0 && (
                  <ul className={styles.tagSuggestions}>
                    {tagSuggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => selectTagSuggestion(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.tagsContainer}>
                {formData.tags.map((tag, index) => (
                  <div key={index} className={styles.tag}>
                    {tag}
                    <button type="button" onClick={() => removeTag(index)} className={styles.removeTag}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && <div className={styles.errorMessage}>{errors.tags}</div>}
              {/* IMAGE UPLOAD SECTION */}
              <h3>Project Images</h3>
              <div
                className={styles.imageDropArea}
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
              <div className={styles.imageFilesContainer}>
                {imageFiles.map((file, index) => (
                  <div key={index} className={styles.imageFile}>
                    <span>{file.filename}</span>
                    <button type="button" onClick={() => removeFile(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.stepNavigation}>
                <button type="button" onClick={handlePreviousStep} className={styles.formButton}>
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className={styles.formButton}>
                  {isSubmitting ? "Submitting..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditReportModal;
