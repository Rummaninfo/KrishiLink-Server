This backend powers the KrishiLink client application by handling crops, interest submissions, and owner request management.

---

## 🌟 Website Features (Server Side)

- REST API to manage crop listings (create, read, update, delete).
- Stores user interest requests (quantity, message, status).
- Prevents sending interest twice for the same crop.
- Handles accept/reject actions by crop owners with automatic quantity updates.
- Provides separate endpoints for buyers and sellers.
- MongoDB database with structured models for stable data processing.

---

## 🛠️ Tech Used
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS + dotenv
- Vercel serverless deployment