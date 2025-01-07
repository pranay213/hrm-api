import mongoose, { Schema, Document } from 'mongoose';

interface ICompany extends Document {
  name: string; // Company name
  accountId: mongoose.Types.ObjectId; // Refers to the Account model
  createdBy: mongoose.Types.ObjectId; // Refers to the User model
  permissions: mongoose.Types.ObjectId[]; // List of Module IDs specific to the company
  isActive: boolean; // Status of the company
  account?: mongoose.Types.ObjectId; // Optional reference for population
  address: string; // Company address
  logo: string; // Company logo URL
}

const CompanySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    accountId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Account', // Refers to the Account model
    },
    address: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Admin', // Refers to the User model
    },
    permissions: {
      type: [mongoose.Types.ObjectId], // Array of Module IDs specific to the company
      ref: 'Module', // Refers to the Module collection
    },
    logo: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt
  },
);

const Company = mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
