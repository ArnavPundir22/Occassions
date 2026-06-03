# Functional Architecture Document (FAD) - Occassions

## 1. Introduction
This document defines the functional scope of the Occassions platform, breaking down the business requirements into logical modules and user roles.

## 2. User Roles & Personas
- **Host (Event Organizer):** Users who create, manage, and analyze events. They have administrative rights over the events they author.
- **Attendee (Guest):** End-users who browse public event feeds and register for specific events.
- **Unauthenticated Visitor:** Can view public event details but must authenticate to register.

## 3. Core Functional Modules

### 3.1 Authentication & Profile Module
- **User Registration/Login:** Secure access via email/password or OAuth.
- **Role Assignment:** Distinguishing between Hosts and standard Attendees.

### 3.2 Event Management Engine (Host-Facing)
- **Event Creation:** Form capturing Title, Description, Date, Time, Location, Capacity, and Banner Image.
- **Dashboard:** A centralized view of all events created by the host.
- **Event Modification/Deletion:** Ability to edit event details or cancel/delete events.
- **Export Utility:** Triggering CSV generation for attendee manifests.

### 3.3 Registration & Discovery Module (Attendee-Facing)
- **Event Feed:** A searchable/filterable list of upcoming public events.
- **Event Details Page:** High-conversion landing page for specific events showcasing details.
- **RSVP Engine:** Handles the registration transaction, strictly validating against event capacity limits.

## 4. Process Flows

### 4.1 Event Creation Flow
1. **Host** logs into the dashboard.
2. Clicks "Create Event" and fills out the necessary metadata.
3. Submits the form.
4. System validates the inputs and saves the event document in MongoDB.
5. System redirects the Host to the new Event Details page and provides a shareable link.

### 4.2 Registration Flow
1. **Attendee** navigates to an event link.
2. Attendee clicks "Register".
3. System checks session (prompts login if unauthenticated).
4. System verifies current registration count against total capacity.
5. If valid, System creates a registration record and increments the event RSVP count.
6. System displays a success confirmation UI (and triggers a toast notification).
