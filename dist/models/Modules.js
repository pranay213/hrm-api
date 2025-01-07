"use strict";
// import mongoose, { Schema, Document } from 'mongoose';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importStar(require("mongoose"));
const ModuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: false },
    status: { type: Boolean, default: true },
}, { timestamps: true });
const Module = mongoose_1.default.model('Module', ModuleSchema);
exports.default = Module;
