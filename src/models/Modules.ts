// import mongoose, { Schema, Document } from 'mongoose';

// interface IModule extends Document {
//   name: string;
//   backendPath: string;
//   frontEndPath: string;
//   parent?: mongoose.Types.ObjectId; // Reference to the parent module
//   children?: mongoose.Types.ObjectId[]; // Array of child module references
//   metadata?: Record<string, any>; // Additional metadata for flexibility
// }

// const ModuleSchema: Schema = new Schema(
//   {
//     name: { type: String, required: true, unique: true },
//     backendPath: { type: String, required: true, unique: true },
//     frontEndPath: { type: String, required: true, unique: true },
//     icon: { type: String, required: false },
//     parent: { type: Schema.Types.ObjectId, ref: 'Module', default: null }, // Reference to the parent module
//     children: [{ type: Schema.Types.ObjectId, ref: 'Module' }], // References to child modules
//     metadata: { type: Schema.Types.Mixed, default: {} }, // Additional metadata (dynamic fields)
//     status: { type: Boolean, default: true },
//   },
//   { timestamps: true }, // Automatically include createdAt and updatedAt fields
// );

// const Module = mongoose.model<IModule>('Module', ModuleSchema);

// export default Module;

import mongoose, { Schema, Document } from 'mongoose';

interface IModule extends Document {
  name: string;
  status: boolean;
}

const ModuleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: false },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }, // Automatically include createdAt and updatedAt fields
);

const Module = mongoose.model<IModule>('Module', ModuleSchema);

export default Module;
