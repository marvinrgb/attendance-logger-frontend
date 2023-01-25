import express from 'express';
const app = express()
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Handle requests for non-root paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Start the server
const port = 4002
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})