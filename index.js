// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const Property = require('./Model/Property'); // Import the Property model

// const app = express();
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://lokeshgodewar607:F9R4eqYuI7lZq5B3@cluster0.0u95i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// // Root route (to handle base route)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Property API');
// });

// // Add new property (CREATE)
// app.post('/api/properties', async (req, res) => {
//   try {
//     const newProperty = new Property(req.body);
//     await newProperty.save();
//     res.status(201).json(newProperty);
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid JSON data' });
//   }
// });

// // List all properties (READ)
// app.get('/getdata/properties', async (req, res) => {
//   try {
//     const properties = await Property.find();
//     res.status(200).json(properties);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to retrieve properties' });
//   }
// });

// // Delete a property (DELETE)
// app.delete('/deletedata/properties/:id', async (req, res) => {
//   try {
//     const deletedProperty = await Property.findByIdAndDelete(req.params.id);
//     if (!deletedProperty) return res.status(404).json({ error: 'Property not found' });
//     res.status(204).send(); // No content
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to delete property' });
//   }
// });

// // Edit a property (UPDATE)
// app.put('/editdata/properties/:id', async (req, res) => {
//   try {
//     const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedProperty) return res.status(404).json({ error: 'Property not found' });
//     res.status(200).json(updatedProperty);
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to update property' });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors());
app.use(express.static('public'));
// Connect to MongoDB database
mongoose.connect('mongodb+srv://lokeshgodewar607:P33HndglzLO0lLMh@test-pro-db.gff5v.mongodb.net/?retryWrites=true&w=majority&appName=test-pro-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Define schema for data
const dataSchema = new mongoose.Schema({
    name: String,
    location: String,
    price: Number,
    description: String,
    propertyType: String,
    imageUrl: String
});

const Data = mongoose.model('Data', dataSchema);

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes for CRUD operations

// Create a new data item
app.post('/data', async (req, res) => {
    try {
        const data = new Data({
            name: req.body.name,
            location: req.body.location,
            price: req.body.price,
            description: req.body.description,
            propertyType: req.body.propertyType,
            imageUrl: req.body.imageUrl
        });

        await data.save();
        res.json({ message: 'Data created successfully' });
    } catch (err) {
        console.error('Error creating data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read all data items
app.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read a specific data item by ID
app.get('/data/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/data', async (req, res) => {
    try {
        // Extract query parameters
        const { name, location, minPrice, maxPrice, propertyType } = req.query;
        
        // Build dynamic query object
        let query = {};

        // Search by name (case-insensitive)
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by price range
        if (minPrice && maxPrice) {
            query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }

        // Filter by property type
        if (propertyType) {
            query.propertyType = propertyType;
        }

        // Fetch filtered properties from MongoDB
        const data = await Data.find(query);
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Update a data item by ID
app.put('/data/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        data.name = req.body.name;
        data.imageUrl = req.body.imageUrl; // Update image URL

        await data.save();
        res.json({ message: 'Data updated successfully' });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a data item by ID
app.delete('/data/:id', async (req, res) => {
    try {
        const data = await Data.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
