# System Architecture & Schema

Occassions is built utilizing the modern **Next.js 15 App Router** paradigm, leaning heavily on Server Actions (via Route Handlers) and Client Components for maximum performance and interactivity.

## 📂 Project Structure

```text
/src
  /app
    /(auth)              # Grouped routes for authentication
      /login/page.tsx
      /register/page.tsx
    /api                 # Next.js Route Handlers (Backend APIs)
      /auth/[...nextauth]/route.ts
      /events/route.ts
      /register/route.ts
      ...
    /attendee            # Attendee specific views
      /my-events/page.tsx
    /dashboard           # Host specific views
      /[eventId]/page.tsx
      /create-event/page.tsx
      /page.tsx
    /events              # Public event pages
      /[eventId]/page.tsx
    layout.tsx           # Main application layout with Providers
    page.tsx             # Public landing page (Home)
    providers.tsx        # NextAuth Session & Toast Providers
  /components            # Reusable UI components
    Navbar.tsx
  /lib                   # Utility functions & configs
    auth.ts              # NextAuth configuration
    mongoose.ts          # MongoDB connection logic
  /models                # Mongoose Database Schemas
    Event.ts
    Registration.ts
    User.ts
```

## 🗄️ Database Schema (MongoDB)

We utilize three primary models to handle the business logic of the application.

### 1. User Model (`User.ts`)
Stores both hosts and attendees.
- `name` (String, Required)
- `email` (String, Required, Unique)
- `password` (String) - *Hashed using bcryptjs*
- `role` (Enum: `HOST` | `ATTENDEE`) - *Determines dashboard access*

### 2. Event Model (`Event.ts`)
Stores the event details created by a Host.
- `title`, `description`, `date`, `time`, `location` (Strings, Required)
- `hostId` (ObjectId, Ref: 'User', Required)
- `capacity` (Number, Optional)
- `cutoffDate` (Date, Optional)
- `isClosed` (Boolean, Default: false)

### 3. Registration Model (`Registration.ts`)
The pivot/mapping table that links Attendees to Events.
- `eventId` (ObjectId, Ref: 'Event', Required)
- `attendeeId` (ObjectId, Ref: 'User', Required)
- **Index**: `{ eventId: 1, attendeeId: 1 } { unique: true }`
  - *This ensures an attendee can never register for the same event twice.*

## 🔒 Authentication Flow
We use **NextAuth.js v4** utilizing the `CredentialsProvider`. 
1. The user logs in via `/api/auth/callback/credentials`.
2. NextAuth securely connects to MongoDB, hashes the inputted password, and compares it to the database record.
3. If successful, NextAuth generates a JWT (JSON Web Token) session.
4. The JWT `token` is customized via callbacks to inject the user's `id` and `role` so that we never have to query the database again just to check a user's permissions!
