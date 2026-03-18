# Houseplant E-commerce (Full-Stack Portfolio)

## Project Overview
<div>
  <img width="600" alt="image" src="./frontend/public/images/Landing_2.webp">
</div>

#### Houseplant E-commerce is a full-stack portfolio project that demonstrates a complete online shopping experience, including authentication, payments, and cloud storage.

| Live Site | Project Duration | Status |
| :--- | :--- | :--- |
| [houseplant-portfolio.com/](https://www.houseplant-portfolio.com) | Oct 2025 – Mar 2026 | Deployed and Maintained |

---

## Technical Stack

This project was developed independently, covering design, frontend, and backend development.

| Category | Tools & Technologies |
| :--- | :--- |
| **Frontend** | Next.js, React, Tailwind CSS |
| **Backend** | NestJS, Prisma, PostgreSQL |
| **Cloud & Infrastructure** | AWS EC2, AWS RDS, AWS S3 |
| **Storage (Dev/Test)** | MinIO |
| **Authentication** | Google OAuth 2 |
| **Payments** | Stripe |
| **External APIs** | Google Maps API |
| **Design** | Figma |
| **DevOps & Tools** | Docker, Git, GitHub |
| **Deployment** | Vercel (Frontend), AWS EC2 (Backend) |

---

## Key Features & Page Breakdown

### Authentication (Login / Signup)
- Secure authentication using JWT stored in HTTP-only cookies to prevent XSS attacks, with the Secure flag enabled for HTTPS transmission
- Google OAuth2 login integration
- Persistent login with refresh token strategy

### Product Browsing
- Browse houseplant products with optimized image loading
- Dynamic product pages with detailed information

### Cart System
- Add/remove items and manage quantities
- Real-time cart updates with backend synchronization

### Checkout & Payment
- Secure checkout process integrated with Stripe
- Payment intent handling and order confirmation flow

### Order Management
- Track user orders and purchase history
- Backend order processing with database persistence

### Image Upload & Storage
- Image upload and delivery via AWS S3
- Unique file naming strategy to prevent predictable access

### Address Search
- Address lookup using Google Maps API
- Improved user experience for shipping information
