require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

let refreshTokens = [];

// Generate Access Token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Refresh Access Token Route
app.post('/token', (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Get from cookies
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({ name: user.name });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.json({ message: "Access token refreshed" });
    });
});

// Logout (Clear Cookies)
app.delete('/logout', (req, res) => {
    // Clear the refresh token and access token cookies
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/"
    });

    // remove the refresh token from your internal store
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);

    res.sendStatus(204);
});


// Login
app.post('/login', (req, res) => {

    const username = req.body?.username;
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const user = { name: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    // Set Access Token (expires in 15m)
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000
    });

    // Set Refresh Token (longer expiration)
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Logged in" });
});


app.listen(4000, () => console.log("Server running on port 4000"));
