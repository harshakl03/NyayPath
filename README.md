# 🏛️ NyayPath - Backend Setup  

## 📌 Overview  
NyayPath is a digital solution designed to **increase awareness about mediation in Indian communities & institutions**.  
The **backend system** powers the AI-driven **Mediator Finder, Chatbot, Case Storage, and Security Features**.  

This repository contains the **Node.js (Express) backend**, which interacts with:
- **MongoDB** → Stores mediators, users, and case data.  
- **BHASHINI API** → Handles speech-to-text & multilingual translations.  
- **AI Model (Python API)** → Intelligent mediator matching (to be integrated).  
- **Blockchain (Smart Contracts + IPFS)** → Secure case storage & document verification.  

---

## 🚀 Tech Stack  
- **Backend:** Node.js (Express.js)  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Document Generation:** PDFKit  
- **AI Integration:** FastAPI (Python)  
- **Blockchain:** Solidity (Ethereum/Polygon)  

---

## 🛠️ Installation  

### 1️⃣ **Clone the Repository**  
```
git clone https://github.com/harshakl03/NyayPath.git
cd NyayPath
```

### 2️⃣ Install Dependencies
Before running the backend, install all required Node.js modules:
```
npm install
```

### 3️⃣ Run Collection Seeders
The project contains seeders located in the /seeders folder.
Run the following commands one by one to populate the collection:
```
node ./seeders/authSeeder.js
node ./seeders/userSeeder.js
node ./seeders/mediatorSeeder.js
node ./seeders/caseSeeder.js
node ./seeders/bookingSeeder.js
node ./seeders/hearingSeeder.js
```

### 4️⃣ Start the Server
Once the collection is seeded, start the backend server:
```
nodemon index.js
```
