const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quickbite';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Please ensure MongoDB is running (e.g. `mongod` or Windows service) or set MONGODB_URI in backend/.env');
    return false;
  }
};

module.exports = connectDB;
