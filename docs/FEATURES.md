# Detailed Feature Breakdown

Occassions was built with a rich set of features that fulfill the core requirements and expand upon them with multiple bonus features for a robust user experience.

## 👑 Host Features

### 1. Unified Authentication
Hosts can create an account using a custom credentials system built on NextAuth.js. During registration, users can check the "I am a Host" box to receive the `HOST` role.
- Passwords are securely hashed via `bcryptjs`.
- Session management is handled automatically across the application.

### 2. Protected Dashboard
The host dashboard (`/dashboard`) is heavily protected both client-side and server-side.
- If an unauthenticated user or a regular `ATTENDEE` tries to visit the dashboard, they are instantly redirected.
- Hosts can view all events they have created in a beautiful grid layout.

### 3. Comprehensive Event Creation
Hosts can create events using an intuitive form. Supported fields include:
- **Event Title**, **Description**, **Date**, **Time**, **Location** (Mandatory).
- **Capacity Limits (Bonus)**: Hosts can restrict how many people can attend.
- **Cutoff Dates (Bonus)**: Hosts can set a strict deadline for registration.

### 4. Attendee Management & Export
Hosts can click on any of their specific events to view a dedicated management dashboard (`/dashboard/[eventId]`).
- **Search (Bonus)**: Hosts can instantly search attendees by Name or Email.
- **CSV Export**: With a single click, hosts can download a beautifully formatted `.csv` file containing their attendees' Names, Emails, and Registration Timestamps. Passwords are never exposed.

---

## 🎟️ Attendee Features

### 1. Seamless Exploration
The main landing page (`/`) acts as a discovery hub where attendees can see all upcoming public events hosted by anyone on the platform. No login is required to browse.

### 2. Public Event Pages
Each event has its own unique, shareable URL (e.g., `/events/12345`).
- The page dynamically shows the event details, location, and schedule.
- **Live Attendee Count (Bonus)**: The page displays how many people have registered, and what the capacity limit is.

### 3. Streamlined Registration
When an attendee clicks "Register Now" on a public page:
- If they aren't logged in, they are prompted to do so.
- When logged in, registration is a one-click process that automatically links their account to the event.
- **Duplicate Prevention (Bonus)**: Our MongoDB compound indexes strictly prevent an attendee from registering for the same event twice.

### 4. Attendee Dashboard
Attendees have their own private dashboard (`/attendee/my-events`) where they can view a list of all events they have successfully registered for.

---

## 💎 Bonus Features Implemented

1. **Prevent Duplicate Registrations**: A user cannot spam register.
2. **Event Capacity Limits**: Fully functional auto-closing of events when full.
3. **Registration Cutoff Date**: Auto-locking events when the clock runs out.
4. **Live Attendee Count**: Visible to everyone on the public page.
5. **Real-time Table Search**: Instant text filtering on the Host's management table.
6. **Responsive UI**: The entire app scales perfectly from a 4k monitor down to a mobile iPhone.
