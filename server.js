const http = require('http');
const userRt = require('./routes/users.routes.js');
const walletRt = require('./routes/wallets.routes.js');


let server = http.createServer((req, res) => {
    if(req.url.startsWith('/users')){
        return userRt(req, res);
    }
    if(req.url.startsWith('/wallets') || req.url.endsWith('/wallets')) {
        return walletRt(req, res);
    }
})

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})