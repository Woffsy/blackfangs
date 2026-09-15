// random youtube video helped me make this bit

require("dotenv").config(); //this is to make it possible to load stuff from the .env file
const express = require("express"); //this loads the package called express into the program yay
const session = require("express-session"); //this is for user-sessions
const passport = require("passport"); //this is a general authentication framework
const DiscordStrategy = require("passport-discord").Strategy; //this is to make discord login actually work

const { checkUserRole } = require("./roleChecker"); //role checking bot code
const { ensureMember } = require("./ensureMember");

const { sendMessage } = require("./corruptionBot")


const app = express(); // this is our server
const PORT = 3000; // number for the funsies

app.use(express.json()); //lets us read JSON bodies sent from fetch calls

//this is to start up the part that handles sessions and login
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //false as long as we arent running a HTTPS server
}));

app.use(passport.initialize());
app.use(passport.session());

//makes it so the logged-in.html doesnt get sent before a user is logged in
app.get("/pages/logged-in.html", ensureMember, (req, res) => {
    res.sendFile(__dirname+"/pages/logged-in.html");
});

app.get("/pages/corruption-test.html", ensureMember, (req, res) => {
    res.sendFile(__dirname+"/pages/corruption-test.html")
})

app.use(express.static("."));

//give passport the strategy to use
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ["identify"] //this is to get the discord user id
}, async (accessToken, refreshToken, profile, done) => {
    //contains id, username, discriminator, avatar
    try {
        const discord_ID = await checkUserRole(profile.id);
        profile.hasRole = discord_ID.hasRole;
        profile.displayName = discord_ID.displayName;
        profile.nickname = discord_ID.nickname;
        profile.serverDisplayName = discord_ID.serverDisplayName;
        return done(null, profile);
    } catch (err) {
        return done(err);
    }
}));

app.get("/api/guild", async (req, res) => {
    const isMember = req.isAuthenticated() && req.user.hasRole;
    const options = isMember ? {
        headers: { 'Authorization': `Bearer ${process.env.WAPI_TOKEN}` }
    }: undefined

    const response = await fetch("https://api.wynncraft.com/v3/guild/Black%20Fangs", options);

    const guild = await response.json(); // this makes bro into a js object :O

    res.json(guild); // this gives that js object to the browser
});

app.get("/api/player/:username", async (req, res) => {
    const username = encodeURIComponent(req.params.username);
    const isMember = req.isAuthenticated() && req.user.hasRole;

    const options = isMember ? {
        headers: { 'Authorization': `Bearer ${process.env.WAPI_TOKEN}` }
    } : undefined

    const response = await fetch(`https://api.wynncraft.com/v3/player/${username}`, options);
    const player = await response.json();
    res.json(player);
});

app.get("/auth/discord", passport.authenticate("discord"))

app.get("/auth/discord/callback", 
    passport.authenticate("discord", { failureRedirect: "/" }),
    (req, res) => {
        if (req.user.hasRole) {
            res.redirect("/pages/logged-in.html") //succesful login landing page
        } else {
            res.redirect("/")
        }
    }
);

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.send(`<h1>Welcome, ${req.user.username}</h1><pre>${JSON.stringify(req.user, null, 2)}</pre><a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

app.get("/api/me", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, username: req.user.username, hasRole: req.user.hasRole, serverDisplayName: req.user.serverDisplayName });
    } else {
        res.json({ loggedIn: false })
    }
})

app.post("/bot/sendmessage", (req, res) => {
    if (req.isAuthenticated()) {
        sendMessage(req.body.content)
        res.send("Message sent")
    } else {
        res.redirect("/")
    }
})

// this bit turns the server on
app.listen(PORT, "0.0.0.0", () => {
    console.log("Website do be running at http://localhost:3000");
});