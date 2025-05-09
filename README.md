# LegalDocumentAnalysisSystem

to run back end

# Backend Quick Start (Windows)

This guide provides the basic steps to run the backend on your local Windows machine.

## Prerequisites

* **Python 3.x** installed (with "Add Python to PATH" checked).
* **pip** installed.

## Steps to Run the Backend

1.  **Navigate to the Backend Directory:**
    Open Command Prompt or PowerShell and go to the main backend folder:
    ```cmd
    cd backend
    ```
    (or `cd your_backend_folder_name`)

2.  **Create and Activate Virtual Environment:**
    ```cmd
    python -m venv venv
    venv\Scripts\activate
    ```
    (Your prompt should now start with `(venv)`)

3.  **Install Dependencies:**
    ```cmd
    pip install -r requirements.txt
    ```

4.  **Environment Variables:**
    Create a `.env` file in the root of the `backend` directory with the following structure (without the actual values):

    ```
    MISTRAL_API_KEY=YOUR_MISTRAL_API_KEY
    LANGSMITH_API_KEY=YOUR_LANGSMITH_API_KEY
    DATABASE_URL=postgresql+psycopg2://user:password@host:port/database_name
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

    **Note:** Replace the placeholder values with your actual API keys and database connection details.

5.  **PostgreSQL Setup (Briefly):**
    * Ensure you have PostgreSQL installed and running on your local machine.
    * Create a database named `LDAS` (or the name specified in your `.env` file's `DATABASE_URL`). You can use a tool like pgAdmin or the `psql` command-line interface.

6.  **Run Database table creation Script:**
    To create the necessary tables in your PostgreSQL database, navigate inside the `app` directory within your `backend` folder and run the `db.py` script:

    ```cmd
    cd app
    python db.py
    ```

7.  **Run the FastAPI Application:**
    Navigate back to the root of your `backend` directory and run the FastAPI application from within the `app` directory:

    ```cmd
    cd app
    uvicorn main:app --reload
    `''

    start with the auth/register route to login with user name.
    use http://127.0.0.1:8000/docs to test the routes if needed 

    You should see output indicating that the FastAPI server has started (usually on `http://127.0.0.1:8000`). You can then access the API endpoints.

