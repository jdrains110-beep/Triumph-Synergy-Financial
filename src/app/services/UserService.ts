/**
 * User Service
 * Business logic for user management using the framework
 */

import { Framework } from '../../framework';
import { User, CreateUserDTO, UserProfile } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  private framework: Framework;
  private users: Map<string, User> = new Map();

  constructor(framework: Framework) {
    this.framework = framework;
  }

  /**
   * Create a new user
   */
  async createUser(dto: CreateUserDTO): Promise<UserProfile> {
    const logger = this.framework.getLogger();
    const security = this.framework.getSecurity();
    const validation = this.framework.getValidation();

    // Validate input
    const validationResult = validation.validate(dto, [
      { field: 'email', type: 'required' },
      { field: 'email', type: 'email' },
      { field: 'password', type: 'required' },
      { field: 'password', type: 'minLength', value: 8 },
      { field: 'firstName', type: 'required' },
      { field: 'lastName', type: 'required' }
    ]);

    if (!validationResult.valid) {
      logger.error('User validation failed', validationResult.errors);
      throw new Error(`Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
    }

    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(u => u.email === dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await security.hashPassword(dto.password);

    // Create user
    const user: User = {
      id: uuidv4(),
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: 'user',
      accountStatus: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    logger.info('User created', { userId: user.id, email: user.email });

    return this.toUserProfile(user);
  }

  /**
   * Authenticate user
   */
  async authenticate(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const logger = this.framework.getLogger();
    const security = this.framework.getSecurity();

    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await security.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = security.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    logger.info('User authenticated', { userId: user.id, email: user.email });

    return {
      token,
      user: this.toUserProfile(user)
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserProfile> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.toUserProfile(user);
  }

  /**
   * Create or update user from Pi Network authentication
   */
  async createOrUpdatePiUser(piUser: { uid: string; username: string }): Promise<UserProfile> {
    const logger = this.framework.getLogger();

    // Check if user with Pi UID already exists
    const existingUser = Array.from(this.users.values()).find(u => u.piUserId === piUser.uid);

    if (existingUser) {
      // Update existing user
      existingUser.piUsername = piUser.username;
      existingUser.updatedAt = new Date();
      this.users.set(existingUser.id, existingUser);
      
      logger.info('Pi user updated', { userId: existingUser.id, piUid: piUser.uid });
      return this.toUserProfile(existingUser);
    }

    // Create new user from Pi authentication
    const user: User = {
      id: uuidv4(),
      email: `${piUser.username}@pi.network`, // Placeholder email
      passwordHash: '', // No password for Pi users
      firstName: piUser.username,
      lastName: '',
      role: 'user',
      accountStatus: 'active',
      piUserId: piUser.uid,
      piUsername: piUser.username,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    logger.info('Pi user created', { userId: user.id, piUid: piUser.uid });

    return this.toUserProfile(user);
  }

  /**
   * Get user by Pi UID
   */
  async getUserByPiUid(piUid: string): Promise<UserProfile | null> {
    const user = Array.from(this.users.values()).find(u => u.piUserId === piUid);
    if (!user) {
      return null;
    }
    return this.toUserProfile(user);
  }

  /**
   * Convert User to UserProfile
   */
  private toUserProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      accountStatus: user.accountStatus,
      piUsername: user.piUsername
    };
  }
}
