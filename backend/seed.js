require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const User = require('./models/User');

const seedApplications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Create a demo user if not exists
    let user = await User.findOne({ email: 'abhishekkumarp3102@gmail.com' });
    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email: 'abhishekkumarp3102@gmail.com',
        password: 'Abhi@123'
      });
      console.log('Created demo user');
    }

    // Clear existing data
    await Application.deleteMany({});
    console.log('Cleared existing applications');

    // Sample data
    const sampleApplications = [
      {
        user: user._id,
        company: 'Google',
        role: 'Software Engineer Intern',
        status: 'Interview',
        date: new Date('2026-05-01'),
        notes: 'Phone interview scheduled for May 10'
      },
      {
        user: user._id,
        company: 'Microsoft',
        role: 'Frontend Intern',
        status: 'Applied',
        date: new Date('2026-04-28'),
        notes: 'Waiting for response'
      },
      {
        user: user._id,
        company: 'Amazon',
        role: 'SDE Intern',
        status: 'Offer',
        date: new Date('2026-04-25'),
        notes: 'Offer received - Compensation: $10000/month'
      },
      {
        user: user._id,
        company: 'Meta',
        role: 'React Developer Intern',
        status: 'Rejected',
        date: new Date('2026-04-22'),
        notes: 'Not selected after technical round'
      },
      {
        user: user._id,
        company: 'Netflix',
        role: 'UI Engineer Intern',
        status: 'Applied',
        date: new Date('2026-04-20'),
        notes: 'Application submitted'
      }
    ];

    // Insert sample data
    await Application.insertMany(sampleApplications);
    console.log(`✅ Inserted ${sampleApplications.length} sample applications`);

    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedApplications();
