import mongoose, { Schema, Document } from 'mongoose';

interface ICompany extends Document {
  name: string;
  accountType: string;
  createdBy: mongoose.Types.ObjectId; // Refers to the SUPER_ADMIN
}

const departmentSchema = new Schema({
  name: { type: String, required: true },
  permissions: [],
  children: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
  people: [],
});

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  departments: {
    type: Array,
    ref: departmentSchema,
  },
});

const Company = mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
