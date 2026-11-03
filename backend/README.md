# CampusBite Backend - Java 21 & Spring Boot 3.x

Java Spring Boot backend service for the **CampusBite Smart College Canteen Management System**.

---

## 🛠️ Technology Stack & Dual Database Support

| Layer | Technology |
|---|---|
| **Runtime & Language** | Java 21 (LTS) |
| **Framework** | Spring Boot 3.4.3 |
| **Build Tool** | Apache Maven 3.9+ |
| **Development Database** | **H2 In-Memory Database** (PostgreSQL-compatibility mode `MODE=PostgreSQL`) |
| **Production Database** | **PostgreSQL 15+ / 16+** |
| **Persistence / ORM** | Spring Data JPA + Hibernate 6.x |
| **Database Migrations** | Flyway (`flyway-core`, `flyway-database-postgresql`) |
| **Security** | Spring Security 6.x (Stateless REST, Role-Based Access) |
| **Real-Time** | Spring WebSocket (STOMP + SockJS) |
| **Validation** | Jakarta Bean Validation (Hibernate Validator) |
| **Testing** | JUnit 5 (Jupiter), Mockito, Spring Boot Test |

---

## 🔄 Environment Profiles: Switching Between H2 and PostgreSQL

CampusBite is configured with environment-specific profiles:

| Profile | Target Database | Setup Required | When to Use |
|---|---|---|---|
| **`dev` (Default)** | **H2 In-Memory** | **None** (zero download or setup) | Local development, unit/integration testing, rapid prototyping |
| **`prod`** | **PostgreSQL** | PostgreSQL 15/16 database running | Staging, production, persistent multi-instance deployment |

### How to Switch Between Profiles

#### Option 1: Via Environment Variable (Recommended)
```powershell
# For H2 (Default):
$env:SPRING_PROFILES_ACTIVE="dev"

# For PostgreSQL:
$env:SPRING_PROFILES_ACTIVE="prod"
```

#### Option 2: Via Maven / CLI Flag
```powershell
# Run with H2 (Default):
mvn spring-boot:run

# Run with PostgreSQL:
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

#### Option 3: Via `application.yml`
Edit `backend/src/main/resources/application.yml`:
```yaml
spring:
  profiles:
    active: prod  # change from dev to prod
```

---

## 💻 In-Memory H2 Development Console

When running in `dev` profile:
- **H2 Web Console URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:campusbite_dev`
- **User Name**: `sa`
- **Password**: *(leave blank)*

The H2 database is configured in `MODE=PostgreSQL`, ensuring that data types, ANSI sequences, and Flyway migrations execute with PostgreSQL compatibility.

---

## 🗄️ Switching to PostgreSQL Later

When you are ready to switch from H2 to PostgreSQL:
1. Install and start PostgreSQL.
2. Create the database:
   ```sql
   CREATE DATABASE campusbite_db;
   ```
3. Set your credentials in `.env` or system environment:
   ```powershell
   $env:SPRING_PROFILES_ACTIVE="prod"
   $env:DB_HOST="localhost"
   $env:DB_PORT="5432"
   $env:DB_NAME="campusbite_db"
   $env:DB_USERNAME="postgres"
   $env:DB_PASSWORD="your_password"
   ```
4. Start the application. Flyway will execute the exact same migrations against PostgreSQL automatically!

---

## 📁 Package Organization

```
com.campusbite.backend
├── config/              # WebSocketConfig, CORS, Jackson, and application beans
├── controller/          # REST API Controllers (HealthController)
├── dto/                 # Request and response records (ApiResponse, HealthResponseDto, ErrorResponseDto)
├── entity/              # JPA entity models mapped to relational tables
├── exception/           # Global exception handling (@RestControllerAdvice)
├── repository/          # Spring Data JPA repositories
├── security/            # SecurityFilterChain, CORS filter, H2 console access
├── service/             # Transactional business logic & service contracts
└── CampusBiteApplication.java # Spring Boot entry point
```

---

## 🚀 Build and Run Instructions

### 1. Compile the Project
```powershell
mvn clean compile
```

### 2. Run Tests
```powershell
mvn test
```

### 3. Start the Backend Server (Runs on H2 by default)
```powershell
mvn spring-boot:run
```

Once started, the backend server will be listening at `http://localhost:8080`.

---

## 🩺 Health Check Verification

Test the `/api/health` endpoint:

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get | ConvertTo-Json -Depth 5
```

**Expected JSON Response (Dev profile):**
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "UP",
    "appName": "campusbite-backend",
    "version": "1.0.0-SNAPSHOT",
    "javaVersion": "21.0.x",
    "timestamp": "2026-11-03T13:30:00Z",
    "details": {
      "activeProfile": "dev",
      "database": "H2 In-Memory (Dev)",
      "security": "Spring Security Active",
      "phase": "Phase 1 - Java Backend Foundation"
    }
  },
  "timestamp": "2026-11-03T13:30:00Z"
}
```
