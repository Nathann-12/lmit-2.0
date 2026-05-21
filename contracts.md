# API Contracts - Laboratory for Multiscale Innovation Website

## Overview
This document outlines the API contracts for integrating the frontend with the backend. Currently, the frontend uses mock data from `/app/frontend/src/data/mock.js`.

## Mock Data Summary

### 1. Laboratory Information
**Location**: `labInfo` object in mock.js
- Laboratory name, tagline, description
- Contact information (email, phone, address)

### 2. Research Focus Areas
**Location**: `researchFocus` array in mock.js
- 4 research focus areas with titles, descriptions, images, and keywords

### 3. Publications
**Location**: `publications` array in mock.js
- 6 research publications with titles, authors, year, journal, DOI, and PDF links

### 4. Lab Members
**Location**: `labMembers` array in mock.js
- 6 team members with names, titles, images, bios, research interests, email, and social links

### 5. News/Announcements
**Location**: `news` array in mock.js
- 3 news items with titles, dates, excerpts, and images

## Backend API Endpoints to Implement

### 1. GET /api/lab-info
**Purpose**: Fetch laboratory information
**Response**:
```json
{
  "name": "string",
  "tagline": "string",
  "description": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}
```

### 2. GET /api/research-focus
**Purpose**: Fetch all research focus areas
**Response**:
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "image": "string (URL)",
    "keywords": ["string"]
  }
]
```

### 3. GET /api/publications
**Purpose**: Fetch all publications
**Query Parameters**: 
- `limit` (optional): number of publications to return
- `year` (optional): filter by year
**Response**:
```json
[
  {
    "id": "number",
    "title": "string",
    "authors": "string",
    "year": "number",
    "journal": "string",
    "doi": "string",
    "pdf": "string (URL)"
  }
]
```

### 4. GET /api/lab-members
**Purpose**: Fetch all lab members
**Response**:
```json
[
  {
    "id": "number",
    "name": "string",
    "title": "string",
    "image": "string (URL)",
    "bio": "string",
    "research": ["string"],
    "email": "string",
    "linkedin": "string (URL)",
    "scholar": "string (URL)"
  }
]
```

### 5. GET /api/news
**Purpose**: Fetch news/announcements
**Query Parameters**:
- `limit` (optional): number of news items to return
**Response**:
```json
[
  {
    "id": "number",
    "title": "string",
    "date": "string (ISO 8601)",
    "excerpt": "string",
    "image": "string (URL)"
  }
]
```

### 6. POST /api/contact
**Purpose**: Submit contact form
**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "subject": "string (required)",
  "message": "string (required)"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

## MongoDB Collections

### 1. `lab_info` Collection
- Single document with laboratory information

### 2. `research_focus` Collection
- Multiple documents for research areas
- Fields: title, description, image, keywords, order

### 3. `publications` Collection
- Multiple documents for publications
- Fields: title, authors, year, journal, doi, pdf
- Index on: year (descending)

### 4. `lab_members` Collection
- Multiple documents for team members
- Fields: name, title, image, bio, research, email, linkedin, scholar, order

### 5. `news` Collection
- Multiple documents for news items
- Fields: title, date, excerpt, image
- Index on: date (descending)

### 6. `contact_submissions` Collection
- Store contact form submissions
- Fields: name, email, subject, message, submitted_at

## Frontend Integration Steps

1. Create API service file: `/app/frontend/src/services/api.js`
2. Replace mock data imports with API calls
3. Add loading states and error handling
4. Update components to use API data

## Backend Implementation Steps

1. Create MongoDB models for each collection
2. Create seed script to populate initial data from mock.js
3. Implement API endpoints with proper validation
4. Add error handling and logging
5. Test all endpoints

## Notes
- All API endpoints use `/api` prefix as per Kubernetes ingress rules
- Contact form submissions should be stored in database and optionally send email notifications
- Images are currently external URLs; no file upload needed for MVP
- All dates should use ISO 8601 format
