const basicAuth = require('express-basic-auth')
const username = process.env.username || "lantern";
const password = process.env.password || "password";
let user = {}
user[username] = password

const auth = basicAuth({users: user})

module.exports = auth;