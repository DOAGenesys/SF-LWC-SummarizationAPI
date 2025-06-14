# Genesys Cloud Copilot Summary & Wrap-up LWC for Salesforce

**Disclaimer: This code is intended for research and demonstration purposes. It requires extensive testing and adaptation before being considered for use in a production environment. Ensure all security, error handling, and scalability aspects are thoroughly reviewed and addressed according to your organization's standards.**

## Overview

This Salesforce Lightning Web Component (LWC) provides a user interface to display interaction summaries and suggested wrap-up codes generated by Genesys Cloud Copilot. It allows users to view details of an interaction, including a summary, resolution, reason, and follow-up actions. Additionally, it presents up to three AI-suggested wrap-up codes with confidence scores, enabling users to apply a selected wrap-up code directly from the Salesforce interface. This component is designed to be placed on a Salesforce record page, specifically for an object that stores Genesys Cloud interaction details (referred to as `genesysps__Experience__c` in the code).

## Features

* **Interaction Details Display**: Shows key information from Genesys Cloud Copilot:
    * Interaction Summary
    * Resolution
    * Reason
    * Follow-up Actions
* **Wrap-up Code Suggestions**: Displays up to three wrap-up codes (Primary, Secondary, Tertiary) suggested by Genesys Cloud Copilot.
* **Confidence Visualization**: Each suggested wrap-up code and summary section is visually styled (border color) based on its confidence score, providing an intuitive understanding of the AI's certainty.
    * **Low Confidence (e.g., <= 40%)**: Red border
    * **Medium Confidence (e.g., 40-80%)**: Yellow/Orange border (interpolated)
    * **High Confidence (e.g., >= 80%)**: Green border
* **One-Click Wrap-up Application**: Users can click on a suggested wrap-up code to apply it to the corresponding Genesys Cloud interaction.
* **Asynchronous Operations**: Wrap-up code updates are made via an asynchronous callout (`@future` method) to the Genesys Cloud API to prevent UI blocking.
* **User Feedback**:
    * Visual cues (e.g., "Click to apply" indicator, processing animation) enhance user experience.
    * Toast notifications inform the user about the success or failure of operations.
* **Responsive Design**: Includes styling for different screen sizes (e.g., adjustments for viewports <= 768px).
* **Custom Styling**: Utilizes custom CSS for a modern and integrated look and feel within Salesforce Lightning Experience.

## Technical Overview

### Architecture

The solution consists of a Lightning Web Component and an Apex controller:

1.  **`genesysExperienceSummary` LWC**:
    * **HTML (`genesysExperienceSummary.html`)**: Defines the structure and layout of the component, including sections for interaction details and wrap-up codes.
    * **JavaScript (`genesysExperienceSummary.js`)**: Handles client-side logic, retrieves record data using `lightning/uiRecordApi`, processes user interactions (e.g., clicking a wrap-up code), and calls the Apex controller.
    * **CSS (`genesysExperienceSummary.css`)**: Provides custom styling for the component, including confidence-based border colors and hover effects.
    * **Metadata (`genesysExperienceSummary.js-meta.xml`)**: Defines that the component is exposed and can be used on Lightning Record Pages.

2.  **`ExperienceCopilotController` Apex Class**:
    * **`updateWrapUpCode` method**: An `@AuraEnabled` method called by the LWC to initiate the wrap-up code update process. It prepares the data and calls a future method for the actual API callout.
    * **`futureCallout` method**: A `@future(callout=true)` method that performs the HTTP POST request to the Genesys Cloud API endpoint to set the wrap-up code for a specific interaction and participant.
    * **`FlowInputs` inner class**: Defines the structure for the JSON payload sent to the Genesys Cloud API.
    * **`WrapUpException` inner class**: Custom exception class for handling errors related to wrap-up operations.

### Key Components and Logic

* **Data Retrieval**: The LWC uses the `@wire` service with `getRecord` to fetch data from the `genesysps__Experience__c` object. It retrieves various fields related to Copilot summaries, confidence scores, wrap-up codes, and interaction identifiers.
* **Confidence Styling**: The JavaScript controller includes a `getConfidenceColor` function that calculates an RGB color based on a confidence value (0-1). This color is then used to dynamically style the borders of the text areas displaying summaries and wrap-up codes.
* **Wrap-up Code Application**:
    1.  When a user clicks on a wrap-up code box, the `handleWrapUpClick` JavaScript function is triggered.
    2.  It retrieves the `interactionId`, the selected `wrapUpCodeId`, `participantId` (specifically `GC_agent_participant_id__c`), and `communicationId` from the current record's data.
    3.  It calls the `updateWrapUpCode` Apex method.
    4.  The Apex method constructs the JSON payload and the API endpoint.
    5.  The `futureCallout` Apex method then makes an HTTP POST request to `callout:GC_Base_API/api/v2/conversations/calls/{interactionId}/participants/{participantId}/communications/{communicationId}/wrapup`.
* **Named Credential**: The Apex callout uses a Named Credential `GC_Base_API`. This must be configured in Salesforce with the base URL for the Genesys Cloud API.
* **Error Handling**: Both the LWC and Apex controller include error handling. The LWC displays toast notifications for errors, and the Apex controller logs errors and throws `AuraHandledException` or custom `WrapUpException`.

## Setup and Prerequisites

1.  **Deploy Components**:
    * Deploy the `ExperienceCopilotController.cls` Apex class.
    * Deploy the `genesysExperienceSummary` LWC bundle (HTML, JS, CSS, XML).
2.  **Configure Named Credential**:
    * In Salesforce Setup, navigate to "Named Credentials".
    * Create or ensure a Named Credential named `GC_Base_API` exists.
    * Configure it with the appropriate Genesys Cloud API base URL (e.g., `https://api.mypurecloud.com` or region-specific URL) and authentication details (e.g., OAuth 2.0).
3.  **Custom Fields on `genesysps__Experience__c`**:
    * Ensure the `genesysps__Experience__c` object (or your equivalent custom object) has the fields referenced in the LWC and Apex class. These include fields for copilot summaries, confidences, wrap-up codes, interaction ID, participant ID, and communication ID.
4.  **Permissions**:
    * Ensure users have permission to access the `ExperienceCopilotController` Apex class.
    * Ensure users have read access to the fields on the `genesysps__Experience__c` object.

## How to Use

1.  Navigate to the Lightning App Builder for the desired record page (e.g., the record page for `genesysps__Experience__c`).
2.  Drag the `genesysExperienceSummary` LWC from the custom components panel onto the page layout.
3.  The component will automatically use the `recordId` of the page it's placed on.
4.  Save and activate the page.

When viewing a record, the component will display the Copilot summary and wrap-up codes if the corresponding fields are populated on the record. Users can then click a wrap-up code to apply it.

## Key Files

* **`ExperienceCopilotController.cls`**:
    * Handles the server-side logic for updating the wrap-up code via a callout to the Genesys Cloud API.
    * Uses `@AuraEnabled` for methods callable from LWC and `@future(callout=true)` for asynchronous API calls.
* **`genesysExperienceSummary.html`**:
    * The template file defining the LWC's structure.
    * Uses `lightning-icon` for visual elements and standard SLDS (Salesforce Lightning Design System) classes for layout.
    * Displays data dynamically using bound JavaScript properties (e.g., `{summary}`, `{wrapUp1}`).
* **`genesysExperienceSummary.js`**:
    * The client-side controller for the LWC.
    * Uses `@api recordId` to get the current record's ID.
    * Wires to `getRecord` to fetch data.
    * Contains getters to extract field values (e.g., `get summary()`, `get wrapUp1()`).
    * Implements `getConfidenceColor` and `generateStyle` to dynamically style elements based on confidence scores.
    * Handles the `handleWrapUpClick` event to call the Apex method `updateWrapUpCode`.
    * Uses `ShowToastEvent` to display notifications.
* **`genesysExperienceSummary.css`**:
    * Contains all custom styles for the component, including card layout, icon styling, summary box appearance, confidence-based borders, and responsive adjustments.
* **`genesysExperienceSummary.js-meta.xml`**:
    * Configuration file for the LWC.
    * Sets `isExposed` to `true` and targets `lightning__RecordPage`, making the component available in the Lightning App Builder for record pages.

## Error Handling and Logging

* **Apex**: The `ExperienceCopilotController` uses `try-catch` blocks to handle exceptions. Errors are logged using `System.debug` and re-thrown as `AuraHandledException` or custom `WrapUpException` to be caught by the LWC.
* **LWC**: The `genesysExperienceSummary.js` file includes error handling for data loading (`wiredExperience`) and for the wrap-up update process (`handleWrapUpClick`). Errors are displayed to the user via `ShowToastEvent`.
* **Debugging**: Console logs (`System.debug` in Apex, `console.log` and `console.error` in JS) are present throughout the code to aid in debugging. The `DEBUG_HEADER` constants help identify the source of log messages.
