# 🌍 Wanderease

**Wanderease** is a full-stack travel listing web application built using the **MERN stack**.  
It allows users to explore beautiful travel destinations, view details, and experience a responsive and dynamic interface.

---

## 🚀 Live Demo
🔗 **Visit App:** https://wanderease-a46k.onrender.com
---

## 🛠️ Tech Stack

- **Frontend:** EJS, CSS, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Hosting:** Render (for server), MongoDB Atlas (for database)

---

## ✨ Features

- 🏞️ **Dynamic Travel Listings** – Displays a curated list of travel destinations with images, descriptions, and details  
- 🧑‍💻 **User Authentication (Passport.js)** – Secure signup, login, and session management using Passport.js and Express sessions  
- 🔐 **Authorization** – Only logged-in users can create, edit, or delete their own listings and reviews  
- 💬 **Reviews System** – Users can post reviews and ratings for destinations; average ratings displayed dynamically  
- 📡 **MongoDB Atlas Integration** – All listing and user data stored and fetched from a cloud MongoDB Atlas database  
- 🧱 **RESTful Routing & MVC Architecture** – Clean and modular structure with routes, models, and views separated  
- ☁️ **Cloud Deployment on Render** – Fully deployed Node.js/Express backend hosted on Render with live MongoDB Atlas connection  
- 🔒 **Environment Variable Security** – Sensitive credentials managed using `.env` files  
- 🎨 **Responsive UI (EJS + Bootstrap)** – User-friendly and responsive design for smooth navigation across devices  
- 🧩 **Scalable Codebase** – Structured to easily add new features like bookings, AI recommendations, or map integrations in the future

---

## 📁 Folder Structure

wanderease/
├── models/
│ └── listing.js
├── routes/
│ └── listings.js
├── public/
│ ├── css/
│ ├── images/
│ └── js/
├── views/
│ └── listings/
│ ├── index.ejs
│ ├── show.ejs
│ └── new.ejs
├── app.js
├── data.js
└── package.json

## 🧩 Future Enhancements

- 🧠 **AI-Powered Travel Recommendations**
  - Suggest destinations based on interests and search patterns.

- 🌍 **Interactive Maps**
  - Integrate Google Maps or Mapbox for location-based browsing.

- 🧳 **User Dashboard**
  - Let users save favorites, manage listings, and view past bookings.
