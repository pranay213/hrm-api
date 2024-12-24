import mongoose, { Schema, Document } from 'mongoose';

interface ICompany extends Document {
  name: string;
  accountType: string;
  createdBy: mongoose.Types.ObjectId; // Refers to the SUPER_ADMIN
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  accountType: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Company = mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
