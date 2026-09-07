const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { processMedicalDocument } = require('./ocrService');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow CORS from frontend (Vite defaults to 5173, but we allow all for now)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Setup Multer for file uploads (store temporarily in 'uploads' folder)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Socket.io for Real-Time Sync (50ms latency)
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Frontend (Patient Kiosk) will emit this when a patient finishes intake
    socket.on('patient_intake_submitted', (data) => {
        console.log('Received patient intake:', data);
        
        // Broadcast to Doctor Dashboards instantly
        io.emit('new_patient_in_queue', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// HTTP Endpoints

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Medikiosk Backend is running' });
});

// Document Upload & OCR Endpoint
app.post('/api/ocr', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Processing document:', req.file.path);
        
        const mimeType = req.file.mimetype;
        
        // Process with Gemini AI
        const medicalData = await processMedicalDocument(req.file.path, mimeType);

        // Delete the temporary file after processing
        fs.unlinkSync(req.file.path);

        // Notify via WebSocket that a new document was scanned (optional)
        io.emit('document_scanned', medicalData);

        return res.json({
            success: true,
            data: medicalData
        });

    } catch (error) {
        console.error('OCR Endpoint Error:', error);
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ 
            error: 'Failed to process document', 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
