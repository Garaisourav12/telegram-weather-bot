import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleSignupStrategy extends PassportStrategy(
  Strategy,
  'google-signup',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://telegram-weather-bot-tasg.onrender.com/api/admin/google/signup/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      username: `${name.givenName} ${name.familyName}`,
      profilePic: photos[0].value,
    };
    done(null, user); // Pass the user object to the next middleware/controller
  }
}
