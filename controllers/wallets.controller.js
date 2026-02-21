import { json } from "stream/consumers";
import {parsebody} from "../parsebody.js";
import fs from 'fs';
const PATH = './database.json';

export const addWallet = async(req, res) =>{
    const body = await parsebody(req);

    const userId = Number(req.url.split("/")[2]);
    let db = getDB();
    let user = db.users.find(u => u.id == userId);
    if(!user){
        res.writeHead(400, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: 'id are required'}));
        return;
    }

    let w = {
        id: Date.now(),
        userName: user.name,
        userId: userId,
        sold: 0
    };
    
    db.wallets.push(w);
    
    // Save database
    fs.writeFileSync(PATH, JSON.stringify(db, null, 2));
    
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Wallet created successfully", wallet: newWallet }));
}

export const getAllWallet = (req, res) => {
    let db = getDB();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db.wallets)); 
}

export const getWallet = (req, res) => {
    const id = Number(req.url.split('/')[2]);
    let db = getDB();
    let wallet = db.wallets.find(w => w.id === id);
    if (!wallet) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Wallet not found" }));
        return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(wallet));
}

export const deletWallet = (req, res) => {
    const id = Number(req.url.split('/')[2]);
    let db = getDB();
    let wallet = db.wallets.find(w => w.id === id);
    if (!wallet) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Wallet not found" }));
        return;
    }
    let newdb = db.wallets.filter(w => w.id !== id);
    db.wallets = newdb;
    fs.writeFileSync(PATH, JSON.stringify(db, null, 2));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Wallet deleted successfully" }));
}

export const withdraw = async (req, res) =>{
    const {walletId, amount} = await getBody(req);
    let db = getDB();
    let i = db.wallets.findIndex(w => w.id ===walletId && w.sold >= amount)

    if(i == -1){
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Wallet not found or dosnt have the amount required"}));
        return;
    }
    db.wallets[i].sold -= amount;

    fs.writeFileSync(PATH, JSON.stringify(db, null, 2));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "sold withdrawed successfully" }));
}

export const deposite = async (req, res) =>{
    const {walletId, amount} = await getBody(req);
    let db = getDB();
    let i = db.wallets.findIndex(w => w.id === walletId)
    if(i == -1){
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Wallet not found for deposite"}));
        return;
    }
    db.wallets[i].sold += amount;
    fs.writeFileSync(PATH, JSON.stringify(db, null, 2));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "sold deposited successfully" }));
}

//helper function------------------- 

const getDB = () =>{
    let data = fs.readFileSync(PATH, 'utf-8');
    return JSON.parse(data);
}

const getBody = (req) =>{
    return new Promise((resolve) => {
        let body ='';
        req.on('data', chunk => body += chunk)
        req.on('end', () => resolve(JSON.parse(body)))
    })
}