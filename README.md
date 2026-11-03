# CampusBite — Smart College Canteen Queue Intelligence & Full Stack Platform

CampusBite is a full stack web platform designed to eliminate peak lunch and dinner canteen counter congestion across college campuses. It combines real-time queue intelligence, 15-minute slot scheduling, station load balancing, and role-based operations for students, kitchen staff, and canteen administrators.

---

## 🏛️ Architecture & Technology Stack

```
canteen-app/
├── backend/                  # Java 21 + Spring Boot 3.4.3 REST API Service
│   ├── .mvn/                 # Maven Wrapper binaries & configuration
│   ├── src/main/java/        # Controllers, Services, Entities, Repositories, DTOs
│   ├── src/main/resources/   # Flyway SQL migrations (V1, V2) & application.yml
│   ├── src/test/java/        # 18 automated JUnit 5 & MockMvc unit & integration tests
│   ├── mvnw & mvnw.cmd       # Official Maven 3.9.9 Wrapper scripts
│   └── pom.xml               # Backend dependency definitions
└── src/                      # React 19 + Vite Frontend Application
    ├── components/           # Student, Kitchen Staff, Admin Dashboards & Minimal Login
    ├── services/             # authService.js (Session & Role management)
    ├── App.jsx               # React Router DOM routing & application state
    └── main.jsx              # React DOM entry point wrapped in BrowserRouter
```

### Technology Highlights
- **Frontend**: React 19, Vite, React Router DOM, Tailwind CSS, Lucide Icons
- **Backend**: Java 21, Spring Boot 3.4.3, Spring Data JPA, Hibernate, Spring Security, Flyway, Maven Wrapper
- **Database**: Dual profile support:
  - **Development (`dev`)**: H2 In-Memory Database with PostgreSQL dialect compatibility & H2 Console at `/h2-console`
  - **Production (`prod`)**: PostgreSQL relational database with pooled connections
- **Migrations**: Automated Flyway SQL migrations (`V1__init_infrastructure.sql`, `V2__create_schema.sql`)
- **Testing**: 18 automated tests passing across service logic and MockMvc REST endpoints

---

## 👥 Role-Based Portals & Access

| Role | Default Campus ID / Email | Default Password | Authorized Route |
|---|---|---|---|
| **Student** | `CS-402` or `student@campusbite.edu` | `student123` | `/student/dashboard` |
| **Kitchen Staff** | `KIT-08` or `chef@campusbite.edu` | `chef123` | `/kitchen/dashboard` |
| **Canteen Admin** | `ADM-01` or `admin@campusbite.edu` | `admin123` | `/admin/dashboard` |

### Role Capabilities
- **Student Portal**:
  - Live menu catalog with categorization (Meals, Breakfast, Fast Food, Beverages)
  - Cart drawer & 15-minute pickup time slot selection
  - Campus Pass Digital Wallet with instant checkout
  - Live order tracking stepper (`PLACED` -> `COOKING` -> `READY`) & scannable QR token pass
- **Kitchen Staff Hub**:
  - Kitchen Display System (KDS) live ticket queue
  - Order status stepper progression
  - Station bottleneck & out-of-stock dish toggles
  - Cafeteria token caller board
- **Canteen Admin Studio**:
  - Menu & pricing studio (add, update pricing, availability)
  - Time-slot capacity limits & surge throttling
  - Student wallet ledger cash-to-digital crediting
  - Financial revenue reports & live broadcast announcement ticker

---

## 🌐 Implemented REST API Endpoints

### Health & Diagnostics
- `GET /api/health` — Reports service status, Java 21 runtime, and active database engine.

### Menu Management
- `GET /api/menu` — List menu items (supports `?category=...` and `?availableOnly=true`).
- `GET /api/menu/{id}` — Get single dish details.
- `POST /api/menu` — Create new dish in catalog.
- `PUT /api/menu/{id}` — Update dish details and pricing.
- `PATCH /api/menu/{id}/availability` — Toggle out-of-stock status.

### Order Processing & Kitchen Operations
- `POST /api/orders` — Place order with backend price calculation & availability pre-validation.
- `GET /api/orders` — List orders (chronological order).
- `GET /api/orders/{id}` — Detailed order breakdown with line items & status audit history.
- `PATCH /api/orders/{id}/status` — Transition order status (`PLACED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`).
- `GET /api/kitchen/orders` — Active kitchen queue tickets.
- `PATCH /api/kitchen/orders/{id}/status` — Kitchen ticket status progression.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ or v20+)
- **Java 21 JDK** (e.g. Eclipse Adoptium Temurin 21)
- Git

---

### 1. Running the Backend (Spring Boot)

Navigate to the `backend` directory:
```bash
cd backend
```

Run tests:
```powershell
# Windows
.\mvnw.cmd clean test

# Linux / macOS
./mvnw clean test
```

Start the server:
```powershell
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

The backend server starts at **`http://localhost:8080`**.
- Health Check: `http://localhost:8080/api/health`
- H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:campusbite;DB_CLOSE_DELAY=-1;MODE=PostgreSQL`)

---

### 2. Running the Frontend (React + Vite)

From the project root:
```bash
npm install
npm run dev
```

The frontend will run at **`http://localhost:5173`**.
- Sign-In Page: `http://localhost:5173/login`

To create a production bundle:
```bash
npm run build
```

---

## 🔒 Security & Route Protection
- Client-side route isolation via `ProtectedRoute` enforces that students cannot access `/admin/dashboard` or `/kitchen/dashboard` and vice versa.
- Unauthenticated visitors are automatically redirected to `/login`.
- Session state is preserved according to the "Remember me" toggle (`localStorage` vs `sessionStorage`).
- Backend is pre-configured with Spring Security and CORS policies allowing development origins (`http://localhost:5173`).
