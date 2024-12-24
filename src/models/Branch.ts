import mongoose, { Schema, Document } from 'mongoose';

interface IBranch extends Document {
  name: string;
  companyId: mongoose.Types.ObjectId; // Refers to the Company
}

const BranchSchema: Schema = new Schema({
  name: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
});

const Branch = mongoose.model<IBranch>('Branch', BranchSchema);

export default Branch;
