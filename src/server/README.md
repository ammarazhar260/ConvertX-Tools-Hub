# ConvertX Backend Server

This is the backend server for ConvertX that handles document conversions and other API requests using the PDF.co API.

## Prerequisites

- Node.js (v14 or higher)
- PDF.co API Key (provided in the code)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on port 3001 by default. You can change this by setting the `PORT` environment variable.

## API Information

This server uses the PDF.co API for document conversion. The API key is pre-configured in the server code:

```javascript
const API_KEY = "imranhosting2@gmail.com_jOTOygIT7v0IzEApQWhBn3cbME2oRKVy2iDyt4kIy6zQCLAivprCIqYmVNQlYqX6";
```

You can check out the PDF.co API documentation at: https://apidocs.pdf.co

## API Endpoints

### PDF.co Status Check

**Endpoint:** GET `/api/pdfco-status`

**Response:**
```json
{
  "success": true,
  "message": "PDF.co service is operational",
  "details": {
    "status": "working",
    "message": "API service is operational"
  }
}
```

### Word to PDF Conversion

**Endpoint:** POST `/api/convert/word-to-pdf`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (Word document)

**Response:**
```json
{
  "success": true,
  "message": "File converted successfully",
  "fileUrl": "http://localhost:3001/output/document-123456789.pdf",
  "fileName": "document-123456789.pdf"
}
```

### PDF to Word Conversion

**Endpoint:** POST `/api/convert/pdf-to-word`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (PDF document)

**Response:**
```json
{
  "success": true,
  "message": "File converted successfully",
  "fileUrl": "http://localhost:3001/output/document-123456789.docx",
  "fileName": "document-123456789.docx"
}
```

## File Storage

- Uploaded files are temporarily stored in the `uploads` directory
- Converted files are stored in the `output` directory
- Files are automatically deleted after 1 hour to save disk space
