/**
 * Framework Security Module
 * Authentication, authorization, and encryption utilities
 */

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export class SecurityModule {
  private jwtSecret: string;
  private bcryptRounds: number;

  constructor() {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be set in production environment');
    }
    this.jwtSecret = process.env.JWT_SECRET || 'default_secret_change_in_production';
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
  }

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.bcryptRounds);
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '24h'
    }) as string;
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.jwtSecret) as JWTPayload;
  }

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .trim();
  }

  /**
   * Validate email format (uses ValidationModule)
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
