import { addWallet, getAllWallet, getWallet, deletWallet, withdraw, deposite } from '../controllers/wallets.controller.js'

export const walletRt = (req, res) => {

    //get all wallets - /wallets
    if(req.method === "GET" && req.url === "/wallets") {
        return getAllWallet(req, res)
    }

    //get wallet - /wallets/1
    if(req.method === "GET" && req.url.startsWith("/wallets/")) {
        const id = req.url.split("/")[2];
        req.params = { id };
        return getWallet(req, res)
    }

    //add wallet - /users/1/wallets
    if(req.method === "POST" && req.url.startsWith("/users/") && req.url.endsWith("/wallets")) {
        return addWallet(req, res);
    }

    //delete wallet - /wallets/2
    if(req.method === "DELETE" && req.url.startsWith("/wallets/")){
        return deletWallet(req, res);
    }

    //withdraw to wallet - /wallet/withdraw
    if(req.method === "POST" && req.url.endsWith("/withdraw")){
        return withdraw(req, res);
    }

    //deposite to wallet - /wallet/deposite
    if(req.method === "POST" && req.url.endsWith("/deposite")){
        return deposite(req, res);
    } 

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
}