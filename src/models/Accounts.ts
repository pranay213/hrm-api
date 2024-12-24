import mongoose, { Schema, Document } from 'mongoose';

interface IAccount extends Document {
  roleType: string; // e.g., 'superadmin', 'admin', 'user'
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  generateAuthToken(): string; // method to generate JWT token
}

const AccountSchema: Schema = new Schema({
  roleType: {
    type: String,
    required: true,
    ref: 'role',
    default: 'superadmin',
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Password hashing middleware

// Generate JWT token

const Account = mongoose.model<IAccount>('Account', AccountSchema);

export default Account;
