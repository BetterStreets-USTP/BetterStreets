require('dotenv').config();
const mongoose = require('mongoose');

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Database Status:\n');
    console.log('Collections:', collections.map(c => c.name).join(', '));
    console.log('\nDocument Counts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━');
    
    for(const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`${col.name}: ${count} documents`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDatabase();
