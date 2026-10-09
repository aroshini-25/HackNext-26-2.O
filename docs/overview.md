# Senior-Centric Medication Management & Caregiver Support

## Project Overview

This project is a web-based medication management and caregiver support system designed to help older adults follow their medication schedules and help caregivers monitor medication activity remotely.

The original idea is a hardware-based medication management project. However, due to time constraints, the hardware has not been developed yet. Instead, a working web prototype has been created using mock data to demonstrate the main features and user workflow.

## Problem Statement

Older adults may need to manage multiple medicines with different schedules, doses, and instructions. Remembering what to take, when to take it, and whether a dose has already been taken can be difficult. Caregivers may not always be physically present, so they need a simple way to check medication activity and identify when support may be required.

## Objectives

- Make medication schedules easier for patients to understand and follow.
- Allow caregivers to add people and manage their medication details.
- Display medication name, scheduled time, and dose clearly.
- Remind patients when a scheduled dose is due.
- Allow patients to confirm when they have taken their medicine.
- Update the caregiver dashboard when a dose is confirmed as taken.
- Provide a calendar to view medication schedules and activity.
- Demonstrate the proposed workflow with mock data until the hardware is developed.

## User Dashboards

### 1. Caregiver Dashboard

The caregiver dashboard allows a caregiver to manage the people they support and their medication schedules.

Features:
- Add and manage patient details.
- Add medication details for each patient.
- Select or enter the medicine name.
- Set the scheduled time for each medicine.
- Specify the dose.
- View medication schedules and status.
- Use the calendar to review scheduled medication activity.
- See when a patient confirms that a medicine has been taken.

### 2. Patient Dashboard

The patient dashboard displays medication information configured through the caregiver dashboard.

Features:
- View assigned medicines, doses, and scheduled times.
- Receive a notification when a medicine is due.
- Repeat the reminder every two minutes until the patient confirms that the medicine has been taken.
- Confirm that a medicine has been taken.
- View scheduled medicines in the calendar.

### 3. Medication Status Synchronization

When a patient confirms a dose as taken, the medication status is updated so that the caregiver dashboard also shows the dose as **Taken**. This provides the caregiver with visibility into the patient's medication activity.

The two-minute reminder behavior and dashboard updates are demonstrated in the current web prototype. Actual hardware-based reminders or dispensing are not implemented yet.

## Calendar

A calendar is included in the project to help users view medication schedules by date and understand the planned medication routine.

## Technology Stack

### Frontend
- React
- JavaScript
- Vite
- HTML
- CSS

### Backend
- Express.js
- TypeScript

### Database
- SQLite
- Prisma ORM

## Current Implementation

The current version is a web prototype that uses mock data to demonstrate the caregiver and patient dashboards, medication scheduling, reminders, confirmation of taken doses, status updates, and calendar view.

The physical hardware component has not been built because of time constraints. The current implementation therefore demonstrates the software workflow rather than integration with a physical medication device.

## Expected Outcome

The project aims to make medication routines clearer for patients and improve caregiver awareness. By showing scheduled medicines, reminding patients at the allocated time, recording their confirmation, and reflecting the updated status in the caregiver dashboard, the prototype demonstrates a more connected medication management workflow.

## Future Enhancements

- Integrate the web application with the planned hardware device.
- Connect reminders to hardware indicators or other notification mechanisms.
- Replace mock data with persistent, real patient and medication records where needed.
- Add secure authentication and role-based access for caregivers and patients.
- Improve reporting of missed, delayed, and completed doses.

## Conclusion

The Senior-Centric Medication Management & Caregiver Support project provides two connected dashboards for caregivers and patients. Caregivers can manage people and their medication schedules, while patients can view their assigned medicines, receive repeated reminders, and confirm when they have taken a dose. The caregiver dashboard reflects the confirmation, and the calendar helps users review medication schedules. Although the project was originally planned as a hardware project, the current prototype uses mock data because the hardware could not be developed within the available time.
