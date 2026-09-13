# 🎮 EsportsConnect

EsportsConnect is a premium, full-stack professional networking platform built exclusively for **Valorant** and **BGMI** players. It is designed to help players showcase their ranks, find elite teammates, and get scouted by competitive organizations.

## ✨ Features
- **Dynamic UI/UX:** A highly interactive, dark-themed UI featuring custom glassmorphism, 3D mouse-tilt cards, magnetic CTAs, and a floating particle background.
- **Player Profiles:** Create comprehensive esports resumes highlighting your rank, roles, signature agents, and social links.
- **Smart Matchmaking:** An advanced algorithm that analyzes your playstyle, rank, and missing roles to suggest the perfect teammates.
- **Team Recruitment:** Post LFP (Looking For Player) ads to recruit specific roles and view applications.
- **Social Feed & Messaging:** A community feed to share achievements and a built-in messaging system to contact potential recruits.
- **Secure Authentication:** JWT-based user authentication and authorization.

## 🛠 Tech Stack
- **Frontend:** React, JavaScript, HTML, Vanilla CSS (No frontend frameworks)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/esports-connect.git
cd esports-connect
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend` directory with the following variables:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App
Open your browser and navigate to `http://localhost:5173`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
