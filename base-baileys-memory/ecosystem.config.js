module.exports = {
    apps : [{
      name: 'chatbot',
      script: 'app.js', // Reemplaza 'index.js' por el archivo principal de tu aplicación
      env: {
        NODE_ENV: 'production'
      }
    }]
  };