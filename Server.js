require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Basic API test
app.get('/api', (req, res) => {
  res.json({ 
    message: '🚀 Your FREE POD Store API is running!', 
    status: 'success',
    service: 'Print-on-Demand Business Backend',
    timestamp: new Date().toISOString()
  });
});

// Printify connection test
app.get('/api/printify-test', async (req, res) => {
  try {
    const axios = require('axios');
    
    console.log('🔐 Testing Printify connection...');
    const response = await axios.get('https://api.printify.com/v1/shops.json', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Printify connection successful!');
    res.json({ 
      success: true, 
      message: '🎉 Printify manufacturing connected successfully!',
      shops: response.data,
      shopCount: response.data.length
    });
    
  } catch (error) {
    console.error('❌ Printify connection failed:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Printify connection failed',
      error: error.message
    });
  }
});

// Get available products from Printify
app.get('/api/products/catalog', async (req, res) => {
  try {
    const axios = require('axios');
    
    console.log('📦 Fetching product catalog...');
    const response = await axios.get('https://api.printify.com/v1/catalog/blueprints.json', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const products = response.data.slice(0, 10); // First 10 products
    
    console.log(`✅ Found ${products.length} products`);
    res.json({
      success: true,
      message: `Found ${response.data.length} available products`,
      products: products,
      productCount: response.data.length
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch catalog:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product catalog',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'POD Store Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    printify: process.env.PRINTIFY_API_KEY ? '✅ configured' : '❌ missing'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n✨ ======================================== ✨');
  console.log('🚀 YOUR FREE POD STORE BACKEND IS RUNNING!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`📦 Printify: ${process.env.PRINTIFY_API_KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log('💰 Cost: $0/month - FREE FOREVER');
  console.log('✨ ======================================== ✨\n');
  
  console.log('📋 Available endpoints:');
  console.log('   GET /api              - Basic API test');
  console.log('   GET /api/health       - Health check');
  console.log('   GET /api/printify-test - Test Printify connection');
  console.log('   GET /api/products/catalog - Get available products\n');
});
