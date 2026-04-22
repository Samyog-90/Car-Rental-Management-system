# Car Rental Management System

##  Overview
The Car Rental Management System is a web-based application designed to streamline and automate the process of renting vehicles. It allows customers to browse available cars, make bookings, upload identification documents, and manage reservations, while administrators can efficiently manage vehicles, users, and rental operations.

This project aims to reduce manual paperwork, improve operational efficiency, and enhance the overall customer experience through a secure and user-friendly platform.

---

## ✨ Features

### 👤 User Features
*   **Smart Fleet Browsing**: Dynamic search and filtering for available vehicles.
*   **Seamless Booking**: Intuitive date and location selection logic.
*   **Integrated Payments**: Secure transactions via the eSewa payment gateway.
*   **Profile Management**: View booking history and personal details.
*   **Document Upload**: Securely upload ID and license for verification.
*   **Interactive Notifications**: Real-time updates on booking status.

### 🛠️ Admin Features
*   **Centralized Dashboard**: Overview of system analytics and operations.
*   **Fleet Management**: Full CRUD operations (Add/Update/Delete) for vehicles.
*   **Booking Oversight**: Approve or reject reservations with logic-based validation.
*   **Message System**: Communicate directly with users from the admin panel.
*   **User Control**: Manage system access and verify user documentation.

---

## 📖 User Guide

### 1. System Access
*   **Launch**: Open your web browser (Chrome, Firefox, or Edge recommended).
*   **URL**: Navigate to the provided system address.
*   **Auth**: Use the **Login** or **Register** links in the navigation bar to get started.

### 2. How to Book a Car
1.  **Find Your Ride**: Head to the **Fleet** page. Use search or category filters to narrow down options.
2.  **Select Dates**: Click on a car to view details, then pick your start and end dates.
3.  **Confirm & Pay**: Review your summary and proceed to **eSewa** for secure payment.
4.  **Success**: Once paid, you'll see a confirmation page with your booking details.

### 3. Managing Your Account
*   Visit the **Profile** page to track your bookings.
*   Update your documentation to ensure a smooth approval process.
*   Use the **Logout** button in the header when you're finished to secure your session.

### 4. Troubleshooting
*   **Error Messages**: If you see a red alert (e.g., "Invalid input"), double-check your fields.
*   **Verification**: Ensure your uploaded documents are clear and readable for the admin to approve.

---

## 🛠️ Technologies Used

### 🌐 Frontend
*   **React.js** (Functional Components, Hooks)
*   **Vite** (Build Tool)
*   **Lucide React** (Modern Iconography)
*   **Axios** (API Communication)
*   **Vanilla CSS** (Custom Premium Styling)

### ⚙️ Backend
*   **Node.js & Express.js**
*   **MongoDB & Mongoose** (NoSQL Database)
*   **JSON Web Tokens (JWT)** (Secure Auth)
*   **bcrypt** (Enterprise-grade Encryption)
*   **Multer** (File Handling)

### 💳 Payment Integration
*   **eSewa Gateway** (SDK-less Implementation)

---

##  System Architecture
The system follows a client-server architecture:

User Interface (React Frontend) → Backend API (Node.js/Express) → Database (MongoDB)

External services such as document verification APIs may be integrated for identity validation.



##  Security Features
- Encrypted passwords using bcrypt
- Input validation
- Secure authentication
- Admin verification system for uploaded documents

---

## 📄 Documentation
The project includes:
- Software Requirements Specification (SRS)
- System architecture diagrams
- User manual
- Technical documentation

---

## 🚀 Future Enhancements
*   **Advanced AI**: Automated license OCR verification.
*   **Mobile App**: Dedicated Android/iOS applications.
*   **Live Tracking**: GPS integration for real-time vehicle monitoring.
*   **Dynamic Pricing**: Algorithm-based price adjusting for peak seasons.

---

##  Author
Developed as a Final Year Project in Software Development.

---

##  License
This project is for educational purposes only.
