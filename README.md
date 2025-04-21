# Genesys Voice Extension - Proof of Concept

## Overview

This Genesys Voice Extension is a **demonstration project** that showcases how to create, deploy, and configure a Lightning Web Component (LWC) as a Voice Extension in Salesforce Service Cloud. 

> **Important Note**: This extension implements mute/unmute functionality which is already available in the native Salesforce call controls. The primary value of this project is as a reference implementation showing how to develop a working Voice Extension, not to add new functionality.

Use this as a starting point for developing your own custom Voice Extensions with unique functionality beyond what's available in the standard interface.

## Purpose of This Project

This project serves several educational purposes:

- Demonstrates the complete lifecycle of creating a Voice Extension
- Shows proper implementation of the Service Cloud Voice Toolkit API
- Provides a working reference for event handling in Voice Extensions
- Illustrates how to configure the extension in the Partner Telephony Contact Center
- Serves as a template that can be extended for actual feature development

## Component Architecture

The extension consists of four files:

1. `genesysVoiceExtension.js` - JavaScript controller demonstrating proper toolkit API usage
2. `genesysVoiceExtension.html` - HTML template showing UI structure for voice extensions
3. `genesysVoiceExtension.css` - CSS styling for voice extension components
4. `genesysVoiceExtension.js-meta.xml` - Component metadata with required targets and capabilities

## Prerequisites

- Salesforce org with Service Cloud Voice enabled
- Partner Telephony from Genesys (CX Cloud)
- Salesforce CLI (for deployment)
- "Customize Application" and "Manage Call Centers" permissions

## Installation

### Option 1: Deploy via Salesforce CLI

1. Clone the repository or download the component files
2. Navigate to the project directory
3. Deploy to your org:
   ```bash
   sf project deploy start -d force-app/main/default/lwc/genesysVoiceExtension -o <your_SF_username>
   ```

### Option 2: Manual Creation in Salesforce Developer Console

1. Open the Developer Console
2. Create a new Lightning Web Component:
   - File > New > Lightning Web Component
   - Enter "genesysVoiceExtension" as the component name
   - Click "Submit"
3. Replace the generated files with the content from this repository
4. Save all files

## Creating a Voice Extension Lightning Page

To use any Voice Extension (including this demo extension), you must create a special Lightning Page and configure it properly:

1. **Navigate to Lightning App Builder**:
   - Go to Setup
   - In the Quick Find box, enter "Lightning App Builder"
   - Click on "Lightning App Builder"

2. **Create a New Lightning Page**:
   - Click "New"
   - Select "App Page" (or "Custom Page" depending on your Salesforce version)
   - Click "Next"

3. **Configure the Page**:
   - Enter a Label (e.g., "Genesys Voice Extension Demo")
   - Enter a Developer Name (e.g., "Genesys_Voice_Extension_Demo")
   - **Critical Step**: For "Page Type", select "Voice Extension"
   - Choose any layout template (single column works well for this component)
   - Click "Next"

4. **Add the Component**:
   - From the "Custom Components" section of the left sidebar, find "genesysVoiceExtension"
   - Drag and drop it onto the page layout

5. **Save and Activate the Page**:
   - Click "Save"
   - Click "Activate"
   - In the activation window, confirm by clicking "Activate"

## Configuring the Voice Extension in Partner Telephony Contact Center

After creating the Lightning Page, you must configure it in your contact center settings:

1. **Navigate to Partner Telephony Contact Centers**:
   - Go to Setup
   - In the Quick Find box, enter "Contact Center"
   - Select "Partner Telephony Contact Centers"

2. **Edit Your Contact Center**:
   - Find your contact center in the list
   - Click the "Edit" link for that contact center

3. **Configure Voice Extension**:
   - In the "Voice Extension" dropdown, select your newly created Lightning Page
   - Optionally, check "Always Show Voice Extension" if you want the extension to appear before, during, and after calls
   - Click "Save"

   ![Contact Center Configuration Example](![image](https://github.com/user-attachments/assets/a5d394ea-adff-4a46-b9de-870b25fb0b1c))

## What You'll Learn From This Project

By studying this reference implementation, you'll learn:

1. **Service Cloud Voice Toolkit API Integration**:
   - How to properly initialize the toolkit API
   - Event subscription patterns for call state management
   - Proper error handling and debug logging techniques

2. **LWC Best Practices for Voice Extensions**:
   - Component lifecycle management
   - Reactive property handling
   - UI state management for telephony applications

3. **Call State Management**:
   - Detecting active calls
   - Handling call events (start, connect, end, etc.)
   - Synchronizing UI state with call state

4. **Deployment Process**:
   - Creating the proper component metadata
   - Building the Lightning Page correctly
   - Configuring the contact center settings

---

## Additional Resources

- [Salesforce Service Cloud Voice Documentation](https://help.salesforce.com/s/articleView?id=sf.voice_setup.htm&type=5)
- [Salesforce SCV Voice Extensions](https://help.salesforce.com/s/articleView?id=service.voice_pt_setup_extensions.htm&type=5) 
- [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
- [Service Cloud Voice Toolkit API Reference](https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_lightning_voicetoolkit.htm)
- [Service Cloud Voice LWC Toolkit API Telephony Events](https://developer.salesforce.com/docs/atlas.en-us.244.0.voice_developer_guide.meta/voice_developer_guide/voice_lc_toolkit_telephony_lwc.htm)
- [Service Cloud Voice LWC Toolkit API Telephony Actions](https://developer.salesforce.com/docs/atlas.en-us.244.0.voice_developer_guide.meta/voice_developer_guide/voice_lc_toolkit_lwc_telephony_actions.htm)
