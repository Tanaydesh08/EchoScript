# EchoScript - Speech to Text Application

EchoScript is a full stack speech-to-text project. The frontend is built with
React, Vite, and Tailwind CSS. The backend is built with Spring Boot, Spring
Security, JWT authentication, PostgreSQL, and the Deepgram API for audio
transcription.

The app lets a user register, login, upload an audio file, convert it into text,
and view saved transcript history.

## Project Folders

```txt
E:\EchoScript
+-- backend\backend    Spring Boot backend API
+-- frontend           React frontend app
```

## Main Features

- User registration and login
- JWT token based authentication
- Audio file upload
- Speech-to-text conversion using Deepgram
- Transcript saving in PostgreSQL
- Transcript history screen in React
- Simple Tailwind CSS layout for learning and easy editing

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript Fetch API
- Browser `localStorage` for JWT token storage

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- Lombok
- JJWT
- Deepgram API

## How The App Works

1. The user creates an account from the React frontend.
2. The backend saves the user with an encrypted password.
3. The user logs in with email and password.
4. The backend returns a JWT token.
5. The frontend stores the token in `localStorage`.
6. The user uploads an audio file.
7. The frontend sends the file to the backend with the JWT token.
8. The backend stores the file in the `uploads` folder.
9. The backend sends the audio file to Deepgram.
10. Deepgram returns the transcript text.
11. The backend saves the transcript in PostgreSQL.
12. The frontend shows the transcript and history.

## Run The Backend

Open a terminal in:

```txt
E:\EchoScript\backend\backend
```

Run:

```bash
mvnw.cmd spring-boot:run
```

The backend runs on:

```txt
http://localhost:8080
```

Make sure PostgreSQL is running and the database from
`application.properties` exists.

## Run The Frontend

Open another terminal in:

```txt
E:\EchoScript\frontend
```

Install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

The Vite frontend proxies `/api` requests to `http://localhost:8080`.

## Backend API Routes

| Method | Route | Auth Needed | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Create a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT token |
| `POST` | `/api/speech/upload` | No | Upload only, without conversion |
| `POST` | `/api/speech/convert` | Yes | Upload and convert audio to text |
| `GET` | `/api/speech/history` | Yes | Get logged-in user's transcript history |
| `GET` | `/api/speech/{id}` | Yes | Get one transcript by ID |
| `GET` | `/api/test` | Yes | Simple protected JWT test route |

## Frontend File Explanation

### `package.json`

Defines the frontend project name, scripts, and dependencies.

Important scripts:

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build.
- `npm run preview` previews the production build locally.

Main dependencies:

- `react` and `react-dom` for building UI.
- `vite` for fast development.
- `tailwindcss` for styling.
- `@tailwindcss/vite` for Tailwind integration with Vite.

### `package-lock.json`

Stores the exact installed dependency versions. This helps everyone install the
same versions with `npm install`.

### `index.html`

The main HTML file used by Vite. It contains the root element:

```html
<div id="root"></div>
```

React renders the full app inside this element.

### `vite.config.js`

Configures Vite, React, Tailwind CSS, and the backend proxy.

The proxy:

```js
"/api": "http://localhost:8080"
```

allows frontend code to call `/api/auth/login` instead of writing the full
backend URL every time.

### `.gitignore`

Tells Git to ignore generated or local files such as:

- `node_modules`
- `dist`
- `.env`
- Vite log files

### `src/main.jsx`

The entry point of the React app. It imports `App.jsx`, imports global CSS, and
renders the app into the `root` div from `index.html`.

### `src/App.jsx`

The main React component. This file contains the beginner-friendly UI logic for:

- Showing login and register forms
- Saving the JWT token after login
- Logging out
- Choosing an audio file
- Uploading audio for conversion
- Showing the latest transcript
- Loading transcript history
- Opening a previous transcript

Important React ideas used here:

- `useState` stores form data, token, selected file, messages, and history.
- `useEffect` loads history after login.
- Form submit handlers call the backend through helper functions.
- Conditional rendering shows either auth screens or the main app.

### `src/api.js`

Contains all frontend API helper functions. Keeping API calls here makes
`App.jsx` easier to read.

Functions:

- `registerUser(formData)` calls `/api/auth/register`.
- `loginUser(formData)` calls `/api/auth/login`.
- `convertAudio(file, token)` sends audio to `/api/speech/convert`.
- `getHistory(token)` calls `/api/speech/history`.
- `getTranscript(id, token)` calls `/api/speech/{id}`.

It also adds the JWT header:

```txt
Authorization: Bearer token
```

### `src/index.css`

Contains Tailwind CSS setup and simple reusable component classes.

Examples:

- `.panel` for white bordered sections
- `.btn-primary` for main buttons
- `.btn-secondary` for secondary buttons
- `.text-input` for form inputs
- `.history-item` for transcript history buttons

The CSS is kept simple so a beginner can understand and modify it.

## Backend File Explanation

### `pom.xml`

The Maven configuration file for the Spring Boot backend.

It defines:

- Java version
- Spring Boot version
- Project dependencies
- Build plugins

Important dependencies:

- `spring-boot-starter-web` for REST APIs
- `spring-boot-starter-security` for authentication
- `spring-boot-starter-data-jpa` for database access
- `jjwt` libraries for JWT token creation and validation
- `postgresql` support through JPA configuration
- `lombok` to reduce boilerplate code
- `org.json` for reading Deepgram JSON response

### `mvnw` and `mvnw.cmd`

Maven wrapper files. They allow the backend to run Maven commands without
installing Maven separately.

Use `mvnw.cmd` on Windows.

### `src/main/resources/application.properties`

Stores backend configuration.

It includes:

- App name
- Server port
- PostgreSQL database URL, username, and password
- Hibernate settings
- JWT secret and expiration time
- Maximum upload file size
- Deepgram API key

Important security note: API keys, JWT secrets, and database passwords should be
moved to environment variables before deploying the project.

### `src/main/java/com/echoscript/backend/BackendApplication.java`

The main Spring Boot starter class. Running this class starts the backend
server.

### `controller/AuthController.java`

Handles authentication routes.

Routes:

- `POST /api/auth/register`
- `POST /api/auth/login`

It receives request data from the frontend and passes it to `AuthService`.

### `controller/SpeechController.java`

Handles audio and transcript routes.

Routes:

- `POST /api/speech/upload`
- `POST /api/speech/convert`
- `GET /api/speech/history`
- `GET /api/speech/{id}`

It stores files, calls Deepgram, saves transcripts, and returns transcript data.

### `controller/TestController.java`

Provides a small test route:

```txt
GET /api/test
```

This route can be used to check whether JWT authentication is working.

### `dto/RegisterRequest.java`

Represents registration data received from the frontend.

Fields:

- `name`
- `email`
- `password`

### `dto/LoginRequest.java`

Represents login data received from the frontend.

Fields:

- `email`
- `password`

### `dto/AuthResponse.java`

Represents the login response sent back to the frontend.

Field:

- `token`

The frontend stores this token in `localStorage`.

### `dto/UploadResponse.java`

Represents a normal upload response.

Fields:

- `message`
- `fileName`

### `dto/TranscriptDto.java`

Represents transcript data sent to the frontend.

Fields:

- `id`
- `fileName`
- `transcript`
- `createdAt`

DTOs are useful because they control what data is sent to the frontend.

### `model/User.java`

JPA entity for the `users` table.

Fields:

- `id`
- `name`
- `email`
- `password`
- `transcriptions`

The `email` field is unique. The user has a one-to-many relationship with
transcriptions.

### `model/Transcription.java`

JPA entity for the `transcriptions` table.

Fields:

- `id`
- `fileName`
- `transcript`
- `createdAt`
- `user`

Each transcript belongs to one user.

### `repository/UserRepository.java`

Spring Data JPA repository for users.

It provides database methods such as:

- `findByEmail(email)`
- `existsByEmail(email)`
- built-in CRUD methods from `JpaRepository`

### `repository/TranscriptionRepository.java`

Spring Data JPA repository for transcripts.

It provides:

- `findByUserId(userId)`
- built-in CRUD methods from `JpaRepository`

### `service/AuthService.java`

Contains registration and login business logic.

During registration:

- Checks if email already exists
- Encrypts the password
- Saves the user

During login:

- Finds the user by email
- Checks the password
- Creates a JWT token
- Returns the token to the frontend

### `service/FileStorageService.java`

Handles audio file validation and saving.

It accepts only:

- `.mp3`
- `.wav`
- `.m4a`

Files are saved in the backend `uploads` folder.

### `service/DeepgramService.java`

Handles communication with the Deepgram speech-to-text API.

It:

- Reads the uploaded audio file
- Sends the file bytes to Deepgram
- Parses the JSON response
- Returns the transcript text

### `service/TranscriptionService.java`

Handles transcript database logic.

It:

- Saves a transcript for a user
- Gets transcript history by user ID
- Gets one transcript by transcript ID

### `security/SecurityConfig.java`

Configures Spring Security.

It:

- Disables CSRF for API usage
- Uses stateless sessions
- Allows public access to `/api/auth/**`
- Allows public access to `/api/speech/upload`
- Protects all other routes
- Adds the JWT authentication filter

### `security/JwtUtil.java`

Creates and validates JWT tokens.

It:

- Generates a token using the user's email
- Extracts the email from a token
- Checks whether a token belongs to the expected user

### `security/JwtAuthenticationFilter.java`

Runs before protected API requests.

It:

- Reads the `Authorization` header
- Extracts the Bearer token
- Validates the token
- Adds the logged-in user to Spring Security context

### `security/CustomUserDetailsService.java`

Loads a user by email for Spring Security.

It converts your app's `User` entity into Spring Security's `UserDetails`
object.

### `config/AppConfig.java`

Creates common backend beans.

Beans:

- `PasswordEncoder` for BCrypt password hashing
- `RestTemplate` for calling the Deepgram API

### `src/test/java/com/echoscript/backend/BackendApplicationTests.java`

Basic Spring Boot test file. It checks whether the application context loads.

### `uploads/`

Stores uploaded audio files. This folder is created and used by the backend
when audio files are uploaded.

## Database Tables

### `users`

Stores user account data.

Important columns:

- `id`
- `name`
- `email`
- `password`

### `transcriptions`

Stores transcript data.

Important columns:

- `id`
- `file_name`
- `transcript`
- `created_at`
- `user_id`

## Frontend And Backend Connection

During development, the React app runs on:

```txt
http://localhost:5173
```

The Spring Boot API runs on:

```txt
http://localhost:8080
```

The frontend calls the backend using `/api/...` paths. Vite forwards those
requests to the backend because of the proxy in `vite.config.js`.

Example:

```js
fetch("/api/auth/login")
```

is forwarded to:

```txt
http://localhost:8080/api/auth/login
```

## Common Problems

### Backend not running

If login or upload fails from the frontend, first check that Spring Boot is
running on port `8080`.

### Database connection error

Check PostgreSQL is running and the database credentials in
`application.properties` are correct.

### Unauthorized request

Protected routes need this header:

```txt
Authorization: Bearer your-jwt-token
```

The frontend adds this automatically after login.

### Audio file rejected

The backend currently accepts only `.mp3`, `.wav`, and `.m4a` files.

## Useful Commands

Frontend:

```bash
npm install
npm run dev
npm run build
```

Backend:

```bash
mvnw.cmd spring-boot:run
mvnw.cmd test
```
