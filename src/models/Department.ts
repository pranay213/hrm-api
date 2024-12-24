import mongoose, { Schema, Document } from 'mongoose';

interface IDepartment extends Document {
  name: string;
  branchId: mongoose.Types.ObjectId; // Refers to the Branch
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
});

const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);

export default Department;
