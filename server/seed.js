import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import User from './src/models/user.model.js';
import { seedUsers } from './src/data/seedUsers.js';

dotenv.config();

async function runSeed() {
  try {
    await connectDB();

    for (const seedUser of seedUsers) {
      const hashedPassword = await bcrypt.hash(seedUser.password, 10);

      await User.updateOne(
        { email: seedUser.email.toLowerCase() },
        {
          $set: {
            name: seedUser.name,
            email: seedUser.email.toLowerCase(),
            password: hashedPassword,
            resetTokenHash: null,
            resetTokenExpiresAt: null,
          },
        },
        { upsert: true }
      );
    }

    const users = await User.find({}, { name: 1, email: 1, _id: 0 }).sort({ email: 1 }).lean();

    console.log('Seed completed successfully. Users in DB:');
    console.table(users);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

runSeed();
