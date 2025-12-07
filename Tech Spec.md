# Technical Specification: Careers Page Builder

## 1. Assumptions & Scope
* **Authentication:** Recruiters need frictionless access. We assume email/password without OTP verification is sufficient for this MVP to speed up testing.
* **Media Hosting:** To keep the architecture lightweight and avoid complex file storage handling within the 6-hour window, we assume recruiters will host assets (logos, banners) externally and provide direct URLs.
* **Data Isolation:** Multi-tenancy is handled via Row Level Security (RLS). A recruiter can strictly only edit their own company data.
* **Public Access:** Candidate views are public and read-only. No candidate login is required to browse jobs.
* **Content Structure:** Section ordering is currently fixed in the UI layout, but visibility is togglable.

## 2. Architecture
The application follows a **Monolithic** structure using **Next.js 15 (App Router)** hosted on Vercel, coupled with **Supabase** (PostgreSQL) for the backend.

### High-Level Components
1.  **Frontend (Next.js):**
    * **Admin Dashboard (`/admin`):** Client-side rendered (CSR) protected route. Uses `useEffect` to fetch user specific data. Heavy use of state for the form builder.
    * **Public Page (`/[slug]`):** Server-side rendered (SSR) route. Fetches data directly from Supabase on the server for optimal SEO and First Contentful Paint (FCP).
    * **Auth (`/login`):** Handles Supabase Auth sessions.
2.  **Backend (Supabase):**
    * **Postgres DB:** Relational data storage.
    * **Auth Service:** JSON Web Token (JWT) management.
    * **Triggers:** Automatically initializes company profiles upon user signup.

### Security Model (RLS)
* **`companies` table:**
    * `SELECT`: Public (true).
    * `UPDATE`: `auth.uid() = id` (Owner only).
* **`jobs` table:**
    * `SELECT`: Public if `is_open = true`.
    * `INSERT/UPDATE/DELETE`: `company_id = auth.uid()` (Owner only).

## 3. Database Schema

### Table: `companies`
| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Linked to `auth.users.id` |
| `slug` | Text | Unique | URL slug (e.g., `acme-inc`) |
| `name` | Text | - | Display name |
| `theme_color` | Text | `#2563EB` | Hex code for branding |
| `logo_url` | Text | - | External image URL |
| `banner_url` | Text | - | External image URL |
| `video_url` | Text | - | YouTube or MP4 URL |
| `sections` | JSONB | `{}` | Toggle state: `{"about": true, "life": false...}` |
| `content` | JSONB | `{}` | Text content: `{"about": "We are...", ...}` |

### Table: `jobs`
| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Gen Random | Primary Key |
| `company_id` | UUID | FK | Linked to `companies.id` |
| `title` | Text | - | Job Title |
| `location` | Text | - | Job Location |
| `type` | Text | - | Full-time, Contract, etc. |
| `description` | Text | - | Full job details |
| `is_open` | Bool | `true` | Visibility toggle |
| `created_at` | Timestamp | `now()` | Sorting |

## 4. Test Plan

### Automated Tests
* N/A for this MVP.

### Manual Test Cases
1.  **Onboarding:**
    * Sign up with a fresh email.
    * Verify redirect to `/admin`.
    * Verify pre-seeded data (Company Name, 3 default jobs) exists.
2.  **Builder functionality:**
    * Change Theme Color -> Save -> Verify specific Hex persists.
    * Toggle "Team Section" OFF -> Save -> Verify section disappears on Public Page.
    * Add Video URL -> Save -> Verify video player renders on Public Page.
3.  **Job Management:**
    * Add new job with description.
    * Delete existing job.
    * Verify Public Page updates immediately (using `force-dynamic`).
4.  **Public View:**
    * Access `/[slug]`.
    * Test "Apply" filters (Location/Type).
    * Click job card to expand description.
    * Verify responsive layout on Mobile view (375px width).