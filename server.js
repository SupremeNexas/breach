const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));  // Serve frontend files

// Serve HTML Page
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Compliance Checker</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                button { background-color: #4CAF50; color: white; padding: 10px; border: none; cursor: pointer; }
                button:hover { background-color: #45a049; }
                .loading { display: none; color: red; }
            </style>
        </head>
        <body>
            <h1>Compliance Checker</h1>
            <label for="complianceType">Select Compliance Type:</label>
            <select id="complianceType">
                <option value="kyc">KYC Compliance</option>
                <option value="loan">Loan Compliance</option>
            </select>
            <input type="file" id="fileInput">
            <button id="uploadButton">Upload & Analyze</button>
            <div id="results"></div>
            <div id="loading" class="loading">Loading...</div>

            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    const fileInput = document.getElementById("fileInput");
                    const complianceSelect = document.getElementById("complianceType");
                    const uploadButton = document.getElementById("uploadButton");
                    const resultsContainer = document.getElementById("results");
                    const loadingIndicator = document.getElementById("loading");

                    uploadButton.addEventListener("click", function() {
                        const file = fileInput.files[0];
                        const complianceType = complianceSelect.value;

                        if (!file) {
                            alert("Please select a file first.");
                            return;
                        }

                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("complianceType", complianceType);

                        loadingIndicator.style.display = "block";
                        resultsContainer.innerHTML = "";

                        fetch("/upload", {
                            method: "POST",
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            loadingIndicator.style.display = "none";
                            resultsContainer.innerHTML = \`
                                <p><strong>File:</strong> \${data.fileName}</p>
                                <p><strong>Compliance Type:</strong> \${data.complianceType}</p>
                                <p><strong>Compliance Score:</strong> \${data.complianceScore}%</p>
                                <p><strong>Status:</strong> \${data.message}</p>
                            \`;
                        })
                        .catch(error => {
                            loadingIndicator.style.display = "none";
                            resultsContainer.innerHTML = \`<p style='color: red;'>Error: \${error.message}</p>\`;
                        });
                    });
                });
            </script>
        </body>
        </html>
    `);
});

// Handle file upload & Compliance Logic (Replaces Python ML)
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const complianceType = req.body.complianceType || "general";

    // **Simulated Compliance Model (Replaces Flask ML)**
    const complianceScore = Math.floor(Math.random() * 100); // Generates random compliance score
    const status = complianceScore >= 50 ? "Compliant" : "Non-Compliant";

    res.json({
        fileName: req.file.originalname,
        complianceType: complianceType,
        complianceScore: complianceScore,
        message: status
    });
});

// Start Node.js server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
