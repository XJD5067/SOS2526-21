import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const SECRET = "sos2526-secret";

const isLocal = process.env.NODE_ENV !== 'production';

const GITHUB_CONFIG = isLocal ? {
    clientID: 'Ov23liyqg7XlV5jwEd4A',
    clientSecret: 'c64143e9da8fc4a0378dc78907f3a6d1ccdd9713',
    callbackURL: 'http://localhost:3000/api/v2/auth/github/callback-mtc'
} : {
    clientID: 'Ov23liZPcE3SaCfUEFPr',
    clientSecret: '602dc423c60bd26773a71f7c3f778a7f1d7e2706',
    callbackURL: 'https://sos2526-21.onrender.com/api/v2/auth/github/callback-mtc'
};

export function loadOAuthMTC(app) {

    app.use(session({
        secret: 'sos2526-session-mtc',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    passport.use('github-mtc', new GitHubStrategy(GITHUB_CONFIG,
        (accessToken, refreshToken, profile, done) => {
            return done(null, { username: profile.username });
        }
    ));

    app.get('/api/v2/auth/github-mtc',
        passport.authenticate('github-mtc', { scope: ['user:email'] })
    );

    app.get('/api/v2/auth/github/callback-mtc',

        passport.authenticate('github-mtc', { failureRedirect: '/cholera-stats-optional' }),
        (req, res) => {
            const token = jwt.sign({ username: req.user.username }, SECRET, { expiresIn: '1h' });
            return res.redirect(`/cholera-stats-optional?token=${token}`);
        }
    );
}