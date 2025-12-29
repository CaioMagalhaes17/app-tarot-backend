import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleUserInfo, IGoogleAuthService } from './use-cases/login-google';

@Injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is required');
    }
    this.client = new OAuth2Client(clientId);
  }

  async verifyToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token payload');
      }

      if (!payload.sub) {
        throw new Error('Google ID not found in token');
      }

      if (!payload.email) {
        throw new Error('Email not found in Google token');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        emailVerified: payload.email_verified || false,
      };
    } catch (error) {
      throw new Error(`Google token verification failed: ${error.message}`);
    }
  }
}
