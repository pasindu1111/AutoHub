# 🚗 AutoHub - Car Marketplace Platform

Group 5 Project
👥Team Members:  
- 37174 - RRPH Gunathilaka  
- 37018 - LB Jayawardana  
- 36725 - WDVW Wickramaarachchi  
- 37222 - SM Asfaq

A full-stack web application for browsing cars, managing favorites, and booking test drives. Built with modern technologies for scalability, security, and user experience.

---

🛠️ Tech Stack

Backend:
- Spring Boot 3.2.5 | Java 21 | Spring Security (JWT) | MySQL 8.0+  
- JPA/Hibernate | MapStruct | Lombok | Brevo Email Service

Frontend: 
- React 19.2 | Vite 7.2 | Ant Design 6.2 | Tailwind CSS 3.4  
- Zustand | Axios | React Router | Framer Motion

---

📋 Features

Customer Features
✅ Browse vehicles with advanced filters (make, model, year, price, fuel, transmission)  
✅ View detailed car information with image galleries  
✅ Save favorite cars for quick access  
✅ Book and manage test drive appointments  
✅ Receive email notifications for booking updates  
✅ Update user profile

Admin Features
✅ Complete vehicle inventory management (CRUD operations)  
✅ Upload and manage multiple images per car  
✅ Update car status (AVAILABLE, SOLD)  
✅ Approve/reject/complete test drive requests  
✅ View all customer bookings



🚀 Getting Started

Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.x

1. Database Setup

mysql -u root -p
CREATE DATABASE autohub;


2. Backend Setup

cd backend

# Configure database (REQUIRED: Set JWT_SECRET)
# Option 1: Edit src/main/resources/application.yml
# Option 2: Set environment variables
export DB_URL=jdbc:mysql://localhost:3306/autohub
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET=your-secret-key-min-256-bits

Run application :

mvn spring-boot:run

Backend runs at `http://localhost:8080/api`

3. Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs at `http://localhost:5173`

4. Default Admin Login
Email: itspasinduhimal@gmail.com  
Password: admin123

---

📡 API Endpoints

Authentication (`/api/auth`)
| Endpoint | Method | Description | 
|----------|--------|-------------|
| `/register` | POST | Create account |
| `/login` | POST | User login | 
| `/logout` | POST | User logout |
| `/refresh` | POST | Refresh token |
| `/me` | GET | Get current user |

Public Cars (`/api/cars`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Browse cars (paginated) |
| `/{id}` | GET | Get car details |

Admin - Cars (`/api/admin/cars`) - ADMIN Only
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET/POST | List/Create cars |
| `/{id}` | GET/PUT/DELETE | View/Update/Delete car |
| `/{id}/restore` | PATCH | Restore deleted car |
| `/{id}/status` | PATCH | Update car status |
| `/{id}/images` | POST | Add images |
| `/{carId}/images/{imageId}/primary` | PATCH | Set primary image |
| `/{carId}/images/{imageId}` | DELETE | Delete image |

Test Drives (`/api/test-drives`) - CUSTOMER Only
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | POST | Book test drive |
| `/my-bookings` | GET | View my bookings |
| `/{id}` | DELETE | Cancel booking |

Admin - Test Drives (`/api/admin/test-drives`) - ADMIN Only
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | View all bookings |
| `/{id}/status` | PATCH | Update status |

Favorites (`/api/favorites`) - CUSTOMER Only
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/{carId}` | POST | Add favorite |
| `/` | GET | List favorites |
| `/with-details` | GET | Favorites with car details |
| `/{carId}` | DELETE | Remove favorite |

User (`/api/users`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/profile` | PATCH | Update profile |

---

📂 Project Structure

```
AutoHub/
├── backend/               # Spring Boot REST API
│   └── src/main/java/com/autohub/
│       ├── controller/    # REST endpoints
│       ├── service/       # Business logic
│       ├── repository/    # Data access
│       ├── entity/        # JPA entities
│       ├── security/      # JWT & auth
│       └── dto/           # Data transfer objects
└── frontend/              # React application
    └── src/
        ├── pages/         # Route components
        ├── components/    # Reusable UI
        ├── api/           # API services
        └── store/         # State management




🔐 Security Features

- JWT-based authentication with HTTP-only cookies
- BCrypt password hashing
- Role-based access control (CUSTOMER, ADMIN)
- Protected routes and endpoints
- CORS configuration for secure cross-origin requests



📄 License

MIT License - feel free to use this project for learning purposes.



**Built with ❤️ by Group 5**
