const axios = require('axios');

exports.handler = async (event) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '');
  const segments = path.split('/').filter(e => e);
  
  // Root endpoint
  if (segments.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: '🚀 Your POD Business API is LIVE!',
        status: 'success',
        endpoints: [
          '/api/printify-test',
          '/api/products/catalog',
          '/api/health'
        ]
      })
    };
  }
  
  // Printify test endpoint
  if (segments[0] === 'printify-test') {
    try {
      const response = await axios.get('https://api.printify.com/v1/shops.json', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: '🎉 Printify Connected! Your manufacturing is ready!',
          shops: response.data
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: error.message
        })
      };
    }
  }
  
  // Products catalog
  if (segments[0] === 'products' && segments[1] === 'catalog') {
    try {
      const response = await axios.get('https://api.printify.com/v1/catalog/blueprints.json', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          products: response.data.slice(0, 12), // First 12 products
          totalProducts: response.data.length
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: error.message
        })
      };
    }
  }
  
  // Health check
  if (segments[0] === 'health') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'healthy',
        service: 'POD Business API',
        timestamp: new Date().toISOString()
      })
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Endpoint not found' })
  };
};
