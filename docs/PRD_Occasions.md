# Product Requirements Document (PRD): Occasions Event System

## 1. Product Overview

**Occasions** is a comprehensive full-stack web application designed for streamlined event registration and management. It bridges the gap between event organizers and attendees by providing an easy-to-use platform for creating events, handling secure registrations, and exporting attendee data for logistics.

## 2. Target Audience

- **Event Organizers (Hosts):** Professionals, corporate coordinators, or community leaders needing a reliable platform to list events, track RSVPs, and manage attendee lists.
- **Attendees (Guests):** Individuals looking for a frictionless way to discover events, register, and receive event details.

## 3. The Problem it Solves

Managing event registrations often involves fragmented tools—using spreadsheets, disjointed email chains, and clunky forms. Occasions centralizes this process. Hosts need a single dashboard to create events and download clean attendee lists (like CSV exports) for day-of coordination, while attendees need a smooth, trustworthy registration flow.

## 4. Core Features

### Must-Have (MVP Core)

- **Role-Based Workflows:** Distinct UI/UX flows for "Hosts" (Event Creators) and "Attendees" (Guests).
- **Secure Authentication:** Robust user login and session management powered by NextAuth.js.
- **Event CRUD Operations:** Hosts can Create, Read, Update, and Delete event listings with details (Date, Time, Location, Capacity).
- **Registration Engine:** Attendees can RSVP/register for events, with capacity limits strictly enforced.
- **Host Dashboard & CSV Export:** Hosts can view all registered attendees for their events and export the data via CSV for offline logistics.

### Nice-to-Have (V1.5 / V2)

- **Integrated Payment Gateway:** For paid/ticketed events (e.g., Stripe integration).
- **Automated Email Reminders:** Sending calendar invites and 24-hour reminders.
- **Advanced Analytics:** Data visualization for Hosts on registration velocity and page views.

## 5. User Flow

1. **Onboarding:** User lands on the homepage and creates an account (or logs in) securely.
2. **Host Flow:**
   - Navigates to the Dashboard.
   - Creates a new event, adding a title, description, time, and banner image.
   - Monitors the event's registration count.
   - Clicks 'Export CSV' to download the finalized guest list before the event.
3. **Attendee Flow:**
   - Browses the public event feed.
   - Clicks on an event to view details.
   - Clicks 'Register'. System verifies capacity and confirms registration.
4. **Post-Event:** Host can archive or delete the event to clean up their dashboard.

## 6. What the MVP Looks Like

A highly responsive, production-ready web application built using **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Data and user sessions are stored securely in **MongoDB**. The UI should be clean, accessible, and fast, utilizing Server-Side Rendering (SSR) for SEO-friendly event pages.

## 7. Success Metrics

- **Liquidity/Adoption:** Number of events created by Hosts per month.
- **Conversion Rate:** Percentage of users who land on an event page and complete the registration.
- **Host Retention:** Percentage of Hosts who return to create a second event.
- **System Reliability:** Zero dropped registrations or double-bookings during high-concurrency event launches.
