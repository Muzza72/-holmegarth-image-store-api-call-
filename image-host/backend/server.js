// Import required packages
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// Create an Express app
const app = express();
const port = 3000; // We'll use port 3000

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());

// --- Static File Serving ---
// This makes the 'uploads' folder publicly accessible via the URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// This serves the main index.html file and other assets from the parent directory
app.use(express.static(path.join(__dirname, '..')));


// --- Multer Configuration ---
// This tells Multer where to save the files and how to name them.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Create a unique filename: timestamp + random number + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- API Endpoint for Uploading ---
// This is the URL the front-end will send the image to.
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  
  // Construct the full URL of the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  // Send the URL back to the front-end in a JSON object
  res.status(200).json({ url: fileUrl });
});

// --- Serve the main HTML file for the root route ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running. Access your app at http://<YOUR_VM_IP>:${port}`);
});
