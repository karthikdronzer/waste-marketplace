# Waste Marketplace

Industries generate waste byproducts that often go unused. This platform lets industries list that waste for sale, and lets buyers browse, filter, and express interest — with the platform earning a fee as the intermediary, similar to how a marketplace connects sellers and buyers.

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
waste-marketplace/
├── client/ → React frontend
└── server/ → Express backend
## Running Locally

**Backend**
cd server
npm install
npm run dev
Requires a `.env` file with `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

**Frontend**

cd client
npm install
npm run dev

## Status
Actively developed as a personal project — core marketplace flow (auth, listings, inquiries) complete; future plans include payment integration for the platform fee model.

## Author
Built by Karthik R — [github.com/karthikdronzer](https://github.com/karthikdronzer)
