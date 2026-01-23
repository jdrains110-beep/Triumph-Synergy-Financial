/**
 * User Model
 * Represents a user in the financial ecosystem
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  accountStatus: 'active' | 'suspended' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  
  // Pi Network specific fields
  piUserId?: string;  // Pi Network UID
  piUsername?: string;  // Pi Network username
  piAccessToken?: string;  // Stored securely, encrypted
}

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  
  // Optional Pi Network fields
  piUserId?: string;
  piUsername?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accountStatus: string;
  piUsername?: string;
}
