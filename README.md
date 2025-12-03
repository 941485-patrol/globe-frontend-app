# Fullstack One Frontend

This is the frontend for a simple task management application.

## Pages

The application consists of the following pages:

*   **Login:** Allows existing users to sign in to their accounts.
*   **Register:** Allows new users to create an account.
*   **Tasks:** The main page of the application, where authenticated users can manage their tasks. This includes creating, viewing, editing, and deleting tasks.
*   **Restrictions:** Users not associated with a task are restricted on editing and delete actions.

## Environment Variables

To configure the application, create a `.env` file in the root directory of the project (see the example_env file for reference). This file should contain the following environment variables:

*   `VITE_BACKEND_API_URL`: The URL of your backend API. For example, `http://localhost:3000`.

Example `.env` file:

```
VITE_BACKEND_API_URL="http://localhost:3000"
```

## Running the app locally

To run the application locally, follow these steps:

1. **Clone repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Running the app with Docker

To run the application using Docker, you can use the provided Docker Compose file.

1.  **Build and run the container:**
    ```bash
    docker-compose up -d --build
    ```
    The application will be available at `http://localhost:5173`.
