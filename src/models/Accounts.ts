import mongoose, { Schema, Document, Mongoose } from 'mongoose';

export interface IAccount extends Document {
  roleType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: [];
  generateAuthToken(): string; // method to generate JWT token
}

const AccountSchema: Schema = new Schema({
  roleType: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Role',
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  permissions: {
    type: [mongoose.Types.ObjectId], // Array of Module IDs specific to the company
    ref: 'Module', // Refers to the Module collection
  },
});

// Password hashing middleware

// Generate JWT token

const Account = mongoose.model<IAccount>('Account', AccountSchema);

export default Account;
