import mongoose, { Schema, Document } from 'mongoose';

interface IRole extends Document {
  name: string;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: Array, ref: 'Module' },
});

const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role;
