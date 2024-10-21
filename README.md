## **Weather Alert Dashboard**

This project is a **weather monitoring dashboard** with backend services for fetching weather data, generating alerts, and displaying them in a clean frontend interface. It uses **TypeScript, Tailwind CSS, MongoDB**, and features APIs for rule evaluation and alerts.

---

## **Table of Contents**

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [System Architecture](#system-architecture)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [API Documentation](#api-documentation)
7. [Alert System Logic](#alert-system-logic)

---

## **1. Project Overview**

This application serves as a **weather monitoring tool**. It checks temperature thresholds and generates alerts based on predefined rules. The backend provides APIs to fetch weather data and alerts, while the frontend displays the information interactively using **Tailwind CSS**.

---

## **2. Technologies Used**

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **API Communication**: Fetch API
- **Rule Engine**: Custom rule engine for evaluating weather alerts
- **Hosting**: Optional (can be deployed to Vercel / DigitalOcean / AWS)

---

## **3. System Architecture**

```plaintext
Frontend (React + TypeScript)
│
├── Fetches weather data and alerts from APIs
│
Backend (Node.js + Express)
│
├── Rules Engine: Evaluates alert conditions
│
└── Database (MongoDB): Stores weather data and alert logs
```

---

## **4. Backend Setup**

### **Prerequisites**

- Node.js and npm installed
- MongoDB server running (see MongoDB installation instructions)

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd weather-alert-dashboard
```

### **2. Install Dependencies**

```bash
cd backend
npm install
```

### **3. Set up Environment Variables**

Create a `.env` file in the backend directory with the following content:

```bash
MONGODB_URI=mongodb://localhost:27017/weatherDB
PORT=5000
WEATHER_API_KEY=<your-weather-api-key>
```

### **4. Run the Backend**

```bash
npm run start
```

---

## **5. Frontend Setup**

### **1. Install Frontend Dependencies**

```bash
cd frontend
npm install
```

### **2. Configure API Endpoints**

In `frontend/src/config.ts`, set the backend URL:

```ts
export const API_BASE_URL = "http://localhost:5000";
```

### **3. Run the Frontend**

```bash
npm run dev
```

---

## **6. API Documentation**

### **1. Get Weather Summary**

**Endpoint**: `/api/weather/summary`  
**Method**: `GET`  
**Description**: Fetches the current weather summary.

**Response Example**:

```json
{
  "temperature": 32,
  "humidity": 70,
  "description": "Partly cloudy"
}
```

### **2. Get Alert Status**

**Endpoint**: `/api/alerts/CityName`  
**Method**: `GET`  
**Description**: Returns whether a temperature alert is active.

**Response Example**:

```json
{
  "alert": true
}
```

---

## **7. Alert System Logic**

The alert system evaluates weather data based on the following rules:

- **Temperature >= 35°C** triggers a high-temperature alert.
- Alerts are **logged in MongoDB** for future reference.

### **Rule Evaluation Logic (Backend Code Snippet)**

```ts
export const evaluateAlert = (
  temperature: number
): { alert: boolean; message: string } => {
  if (temperature >= 35) {
    return { alert: true, message: `High temperature alert: ${temperature}°C` };
  }
  return { alert: false, message: "Temperature is normal." };
};
```
