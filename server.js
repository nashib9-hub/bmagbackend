const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS and increase body size limit for image uploads
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Connect to MongoDB Atlas using Render Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Database Schema for Site Data
const SiteSchema = new mongoose.Schema({
  version: { type: String, default: 'v1' },
  data: { type: Object, required: true }
}, { timestamps: true });

const SiteModel = mongoose.model('SiteData', SiteSchema);

// API Endpoint to Load Site Data
app.get('/api/data', async (req, res) => {
  try {
    let doc = await SiteModel.findOne({ version: 'v1' });
    res.json(doc ? doc.data : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Endpoint to Save / Update Site Data
app.post('/api/data', async (req, res) => {
  try {
    const updatedData = req.body;
    let doc = await SiteModel.findOneAndUpdate(
      { version: 'v1' },
      { data: updatedData },
      { upsert: true, new: true }
    );
    res.json({ success: true, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```[cite: 10, 11]
