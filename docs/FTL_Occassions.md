# Feature Traceability List (FTL) - Occassions

| Feature ID | Feature Name | Description | Target Role | Test Scenario | Expected Outcome | Priority |
|---|---|---|---|---|---|---|
| OCC-F01 | User Authentication | Secure login/registration via NextAuth. | Host, Attendee | User attempts login with valid and invalid credentials. | Valid users access dashboard; invalid receive clear error messages. | MVP |
| OCC-F02 | Create Event | Interface to input event details and create a public listing. | Host | Host fills event form and submits. | Event is saved to DB and appears on Host's dashboard. | MVP |
| OCC-F03 | Edit/Delete Event | Modify event details or remove the event entirely. | Host | Host changes event time; Host deletes event. | Updates reflect immediately; deleted events are removed from DB and feed. | MVP |
| OCC-F04 | Event Feed | Public listing of all upcoming events. | Attendee | User navigates to homepage. | Displays a grid/list of upcoming events sorted by date. | MVP |
| OCC-F05 | Event Registration | Capability to RSVP to an event. | Attendee | Authenticated user clicks "Register" on an event page. | Registration record is created; user sees success toast. | MVP |
| OCC-F06 | Capacity Enforcement | Prevents registration if event is full. | System | User attempts to register for an event at max capacity. | Registration is rejected; UI indicates "Sold Out". | MVP |
| OCC-F07 | Attendee CSV Export | Downloadable list of all registered guests. | Host | Host clicks "Export CSV" on their dashboard. | Browser downloads a properly formatted CSV file with guest names/emails. | MVP |
| OCC-F08 | Payment Gateway | Integration for paid tickets. | Host, Attendee | User attempts to register for a paid event. | Prompts Stripe checkout; registration completes only on success. | V1.5 |
| OCC-F09 | Email Reminders | Automated calendar invites and 24hr reminders. | System | User registers for an event. | System sends confirmation email and schedules a reminder. | V1.5 |
