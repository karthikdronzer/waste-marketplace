# Waste Marketplace

A MERN stack platform connecting industries with reusable byproduct waste to buyers who can put it to use — acting as an intermediary marketplace with a platform-fee business model.

**Live site:** https://waste-marketplace.vercel.app
**Live API:** https://waste-marketplace-api.onrender.com

## Features
- JWT-based authentication with role selection (industry / buyer)
- Password hashing with bcrypt
- Role-based access control (only industries can post listings)
- Ownership-based access control (only the original poster can edit/delete a listing)
- Create, browse, search, filter, update, and delete waste listings
- Image upload for listings via Cloudinary
- Buyer inquiry system — express interest, industry can accept/decline
- Location autocomplete and standardized waste type categories
- Responsive, styled UI with Tailwind CSS

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** JWT, bcrypt
- **Image storage:** Cloudinary
- **Deployment:** Vercel (frontend), Render (backend)

## Project Structure