# Technical Specification: Careers Page Builder

## 1. Assumptions
* **Authentication:** We assume email/password without OTP verification  for this MVP to speed up testing.
* **Data Isolation:** Multi-tenancy is handled via Row Level Security (RLS). A recruiter can strictly only edit their own company data.
* **Public Access:** Candidate views are public and read-only. No candidate login is required to browse jobs.


## 2. Architecture
The application is Monolithic using Next.js 15 hosted on Vercel, along with Supabase for the backend.

### High-Level Components
1.  **Frontend (Next.js):**
    * **Admin Dashboard (`/admin`):** Client-side rendered (CSR) protected route.
    * **Public Page (`/[slug]`):** Server-side rendered (SSR) route.
    * **Auth (`/login`):** Handles Supabase Auth sessions.
      
2.  **Backend (Supabase):**
    * Relational data storage.
    * JSON Web Token (JWT) management for authentication
    * Automatically initializes company profiles upon user signup.



## 3. Database Schema

### Table: `companies`
| Column | Type | 
| :--- | :--- | 
| `id` | UUID | 
| `slug` | Text | 
| `name` | Text | 
| `theme_color` | Text | 
| `logo_url` | Text | 
| `banner_url` | Text | 
| `video_url` | Text | 
| `sections` | JSONB | 
| `content` | JSONB | 

### Table: `jobs`
| Column | Type | 
| :--- | :--- | 
| `id` | UUID | 
| `company_id` | UUID | 
| `title` | Text | 
| `location` | Text | 
| `type` | Text | 
| `description` | Text | 
| `is_open` | Bool | 
| `created_at` | Timestamp | 

## 4. Test Plan


1.  **Onboarding:**
    * Sign up/Sign in with email.
    * Verify redirect to `/admin`.
    * Verify pre built preview page exists.
      
2.  **Builder functionality:**
    * Change Theme Color
    * Toggle  Section
    * Add Video/iamge/baneer URL
      
3.  **Job Management:**
    * Add new job
    * Delete existing job.
    * See Live Preview
   
4.  **Public View:**
    * Can access publicly
    * Tested Filters
    * Click job card to expand description.
    * Verified responsive layout on Mobile view
