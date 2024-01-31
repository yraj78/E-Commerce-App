module.exports = {
    // MongoDB connection string
    MONGODB_URL: 'mongodb://127.0.0.1:27017/mydatabase',
  
    jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  };