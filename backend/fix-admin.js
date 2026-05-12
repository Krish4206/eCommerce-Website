// Fix admin user - delete and recreate
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Get the User model
  const { User } = await import('./models/User.js');

  // Delete existing admin
  await User.deleteOne({ email: 'admin@ecommerce.com' });
  console.log('Deleted old admin');

  // Create new admin (model middleware will hash password)
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'Admin@123',
    role: 'admin'
  });

  console.log('New admin created:', admin.email);
  console.log('Password will be hashed by model middleware');

  process.exit(0);
};

fixAdmin();