# API Reference

Occassions uses Next.js Route Handlers to expose a robust REST API for managing events and attendees. All secure endpoints require a valid NextAuth.js session.

## 🔐 Authentication

### `POST /api/register`
Creates a new user account.
- **Body**: `{ "name": "...", "email": "...", "password": "...", "role": "HOST" | "ATTENDEE" }`
- **Response**: `201 Created`

### `/api/auth/[...nextauth]`
Handled internally by NextAuth.js for logging in and session management.

---

## 📅 Events

### `GET /api/events/all`
Fetches all public events to be displayed on the landing page.
- **Auth**: Public
- **Response**: Array of Event objects.

### `POST /api/events`
Creates a new event.
- **Auth**: Required (`role: HOST`)
- **Body**: `{ "title": "...", "description": "...", "date": "...", "time": "...", "location": "...", "capacity": 100, "cutoffDate": "2026-06-01T00:00:00.000Z" }`
- **Response**: `201 Created`

### `GET /api/events`
Fetches all events specifically hosted by the currently logged-in Host.
- **Auth**: Required (`role: HOST`)
- **Response**: Array of Event objects belonging to the Host.

### `GET /api/events/[eventId]`
Fetches the details of a single public event and its total attendee count.
- **Auth**: Public
- **Response**: `{ "event": { ... }, "attendeeCount": 5 }`

---

## 🎟️ Registrations & Attendees

### `POST /api/events/[eventId]/register`
Registers the currently logged-in attendee for the specified event.
- **Auth**: Required (`role: ATTENDEE`)
- **Checks Performed**: 
  - Validates Event exists.
  - Checks if event `isClosed`.
  - Checks if `cutoffDate` has passed.
  - Checks if `capacity` is reached.
  - Ensures no duplicate registration (handled via MongoDB unique index).
- **Response**: `201 Created`

### `GET /api/attendee/events`
Fetches all events that the currently logged-in Attendee is registered for.
- **Auth**: Required (`role: ATTENDEE`)
- **Response**: Array of Event objects.

### `GET /api/events/[eventId]/attendees`
Fetches the complete list of attendees for a specific event. Used by the Host Dashboard.
- **Auth**: Required (`role: HOST` and must be the creator of the event)
- **Response**: `{ "event": { ... }, "attendees": [ ... ] }`

### `GET /api/events/[eventId]/export`
Generates and downloads a `.csv` file containing the attendee list for the specified event.
- **Auth**: Required (`role: HOST` and must be the creator of the event)
- **Response**: `200 OK` (Content-Type: `text/csv`)
