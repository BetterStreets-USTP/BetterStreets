const mongoose = require('mongoose');
const Report = require('../models/Report');
require('dotenv').config();

async function viewReports() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/betterstreets');
    console.log('✅ Connected to MongoDB\n');

    // Get all reports
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });

    console.log(`📊 Total Reports: ${reports.length}\n`);
    console.log('━'.repeat(80));

    if (reports.length === 0) {
      console.log('\n⚠️  No reports found in the database\n');
    } else {
      reports.forEach((report, index) => {
        console.log(`\n${index + 1}. ${report.title || 'Untitled Report'}`);
        console.log(`   ID: ${report._id}`);
        console.log(`   Category: ${report.category}`);
        console.log(`   Status: ${report.status}`);
        console.log(`   Description: ${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}`);
        console.log(`   Location: ${report.location?.address || 'N/A'}`);
        console.log(`   Coordinates: [${report.location?.coordinates[0]}, ${report.location?.coordinates[1]}]`);
        console.log(`   Reporter: ${report.reporter?.name || 'Unknown'} (${report.reporter?.email || 'N/A'})`);
        console.log(`   Photos: ${report.photos?.length || 0}`);
        console.log(`   Upvotes: ${report.upvotes?.length || 0}`);
        console.log(`   Created: ${report.createdAt}`);
        console.log('   ' + '─'.repeat(76));
      });
    }

    // Stats
    console.log('\n📈 Status Breakdown:');
    const pending = reports.filter(r => r.status === 'pending').length;
    const inProgress = reports.filter(r => r.status === 'in-progress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const rejected = reports.filter(r => r.status === 'rejected').length;

    console.log(`   Pending: ${pending}`);
    console.log(`   In Progress: ${inProgress}`);
    console.log(`   Resolved: ${resolved}`);
    console.log(`   Rejected: ${rejected}`);

    console.log('\n📂 Category Breakdown:');
    const categories = [...new Set(reports.map(r => r.category))];
    categories.forEach(cat => {
      const count = reports.filter(r => r.category === cat).length;
      console.log(`   ${cat}: ${count}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

viewReports();
