// src/types/index.ts

export interface Company {
  _id: string;
  name: string;
  accountType: string; // e.g., 'SUPER_ADMIN', 'REGULAR', etc.
  createdAt: Date;
  updatedAt?: Date; // Optional
}

export interface Branch {
  _id: string;
  companyId: string; // Reference to the Company
  name: string;
  createdAt: Date;
  updatedAt?: Date; // Optional
}

export interface Department {
  _id: string;
  branchId: string; // Reference to the Branch
  name: string;
  createdAt: Date;
  updatedAt?: Date; // Optional
}

export interface Employee {
  _id: string;
  branchId: string; // Reference to the Branch
  name: string;
  email: string;
  role: string; // e.g., 'MANAGER', 'STAFF'
  createdAt: Date;
  updatedAt?: Date; // Optional
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string; // Hashed password
  role: string; // e.g., 'SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'
  createdAt: Date;
  updatedAt?: Date; // Optional
}

export interface AuthPayload {
  userId: string;
  role: string;
}

export interface ErrorResponse {
  message: string;
}
