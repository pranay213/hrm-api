import mongoose, { Schema, Document } from 'mongoose';

interface IEmployee extends Document {
  name: string;
  departmentId: mongoose.Types.ObjectId; // Refers to the Department
  role: string;
  email: string;
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
