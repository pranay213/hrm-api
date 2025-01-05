import mongoose, { Schema, Document } from 'mongoose';

interface IRole extends Document {
  name: string; // Name of the role
  description?: string; // Optional description of the role
  isActive: boolean; // Status of the role
}

const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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

const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role;
