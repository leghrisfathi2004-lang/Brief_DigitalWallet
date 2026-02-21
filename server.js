import http from 'http';
import { userRt } from'./routes/users.routes.js';
import { walletRt } from './routes/wallets.routes.js';


let server = http.createServer((req, res) => {
    if(req.url.startsWith('/wallets') || req.url.includes('/wallets')) {
        return walletRt(req, res);
    }
    if(req.url.startsWith('/users')){
        return userRt(req, res);
    }
})

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})