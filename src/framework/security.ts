/**
 * Framework Security Module
 * Authentication, authorization, and encryption utilities
 */

import * as bcrypt from 'bcryptjs';




export class SecurityModule {

  private bcryptRounds: number;

  constructor() {

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
