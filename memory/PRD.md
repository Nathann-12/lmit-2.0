# PRD - Laboratory for Multiscale Innovative Technologies

## Original Problem Statement
Create a professional and minimalist university research laboratory website for "Laboratory for Multiscale Innovative Technologies". The lab focuses on materials science, nanotechnology, and advanced gas sensors for smart agriculture. Target audience: academic researchers, professors, and university students.

## Required Sections
- Hero with modern lab image background and bold title
- Research Focus with clean grids
- Publications with modern cards
- Lab Members profile section
- News & Announcements (added)
- Contact form (added)

## Design Choices
- Color palette: 60% white/light gray, 30% dark teal/slate (#1e3a5f), 10% teal accent (#0891b2) for buttons
- Modern, clean, highly readable typography
- Minimalist, uncluttered

## User Personas
- Academic researchers seeking collaboration
- University professors evaluating research
- University students exploring lab work
- Industry partners seeking expertise

## What's Been Implemented (2026-05)
- ✅ Frontend (React + Tailwind + shadcn UI)
  - Hero, Research Focus, Publications, Lab Members, News, Contact, Footer
  - Fixed nav with smooth scroll, mobile responsive menu
  - Loading states, toast notifications (sonner)
- ✅ Backend (FastAPI + MongoDB)
  - GET /api/lab-info, /research-focus, /publications, /lab-members, /news
  - POST /api/contact (with email validation, stores submission)
  - All endpoints exclude _id from MongoDB responses
- ✅ Database seeded with 4 research areas, 6 publications, 6 lab members, 3 news items
- ✅ Frontend fully integrated with backend API

### Admin Panel (added 2026-05)
- ✅ JWT auth with seeded admin (`admin@multiscalelab.edu` / from .env)
- ✅ Routes: `/admin/login`, `/admin` (protected)
- ✅ Full CRUD for Research Focus, Publications, Lab Members, News
- ✅ Edit Lab Info (name, tagline, description, contact)
- ✅ View & delete contact submissions (Inbox)
- ✅ Tabs UI with 6 sections, mobile responsive
- ✅ 56/56 backend tests passed (100%, including 38 admin tests)

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui + lucide-react + sonner + axios
- Backend: FastAPI + Motor (async MongoDB) + Pydantic v2
- Database: MongoDB with 6 collections (lab_info, research_focus, publications, lab_members, news, contact_submissions)

## P1 Backlog (Future Enhancements)
- Admin panel to manage publications/members/news without DB access
- Search/filter on publications (by year, author, keyword)
- Email notifications when contact form submitted
- Newsletter signup
- Individual member detail pages
- Publication categories/tags

## P2 Backlog
- Migrate @app.on_event to FastAPI lifespan (deprecation warning)
- Pagination for publications if list grows large
- Image upload for member photos and news
- Analytics dashboard
