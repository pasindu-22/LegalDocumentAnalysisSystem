# Legal Document Analysis System - Frontend

This is the frontend application for the Legal Document Analysis System, built with React.

## Getting Started

Follow these instructions to set up and run the frontend application on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- npm (comes with Node.js)
- Git

### Clone the Repository

```bash
# Clone the entire project repository
git clone https://github.com/yourusername/LegalDocumentAnalysisSystem.git

# Navigate to the project directory
cd LegalDocumentAnalysisSystem

# Navigate to the frontend application directory
cd Frontend/app

# Install dependencies
npm install

# Start the development server
npm start

# Additional libraries
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @mui/lab

```

### Environment Configuration Setup

To configure environment variables for connecting to different backend APIs:

1. **Create environment files** in the React application root directory(In Frontend/app/.env):


#### Create the base .env file (required)
Frontend/app/.env

```bash
# Add this line
REACT_APP_API_URL=YOUR_BACKEND_URL
```
- Example :- REACT_APP_API_URL=http://127.0.0.1:8000/
- Replace it with hosted backend URL if necessary


3. **Restart your development server** after changing environment variables.

**Note:** All environment variables must be prefixed with `REACT_APP_` to be accessible in React.