import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // Check if user exists with the same email
        user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.isEmailVerified = true;
            if (profile.photos?.[0]?.value) {
                user.profilePicture = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
        }

        // Create new user
        user = new User({
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            googleId: profile.id,
            authProvider: 'google',
            isEmailVerified: true,
            profilePicture: profile.photos?.[0]?.value,
        });

        await user.save();
        return done(null, user);
    } catch (error) {
        return done(error, undefined);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
