# Careers Page Builder

A full-stack application that allows recruiters to build, customize, and manage branded careers pages in minutes. Built with Next.js 15, Supabase, and Tailwind CSS.

## 🚀 What I Built
* **Drag-and-Drop Alternative:** A toggle-based "Section Builder" that lets recruiters turn sections (About, Life, Team) on/off and edit content in real-time.
* **Branding Engine:** Recruiters can set a primary brand color, which dynamically generates a pastel background palette and button styles on the public page using CSS `color-mix`.
* **Job Management:** Full CRUD capabilities for open roles, including rich descriptions.
* **Candidate Experience:** A public-facing page (`/company-name`) with instant client-side filtering for job location and type.
* **Automated Onboarding:** Uses SQL Triggers to auto-generate a company profile and sample jobs immediately upon signup.

## 🛠 Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Database & Auth:** Supabase (PostgreSQL + RLS)
* **Styling:** Tailwind CSS + Shadcn/UI
* **Icons:** Lucide React

## 🏃‍♂️ How to Run

### 1. Clone & Install
```bash
git clone <repo-url>
cd careers-builder
npm install