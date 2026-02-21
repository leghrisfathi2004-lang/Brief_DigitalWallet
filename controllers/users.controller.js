import {parsebody} from "../parsebody.js";
import fs from 'fs';
const PATH = './database.json';

export const addUser = async(req, res) => {
    const body = await parsebody(req);
    if(!body.name) {
        res.writeHead(400, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: "Name is required"}));
        return;
    }

    let user = {
        id: getId(),
        name: body.name,
    }

    let db = getDB();
    db.users.push(user);
    db.wallets.push({id: Date.now(), userName: user.name, userId: user.id, sold: 0});

    //save db part
    fs.writeFileSync(PATH, JSON.stringify(db, null, 2));

    res.writeHead(201, {'content-type': 'application/json'});
    res.end(JSON.stringify({message: "User with 1st wallet created successfully", user}));
}

export const getAllUsers = (req, res) => {
    let db = getDB();
    let users = db.users;
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(users));
}

export const getUser = (req, res) => {
    const id = Number(req.url.split("/")[2]);
    let db = getDB();
    let user = db.users.find(u => u.id === id);
    if(!user) {
        res.writeHead(404, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: "User not found"}));
        return;
    }
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(user));
}

export const deletUser = (req, res) => {
    const id = Number(req.url.split("/")[2]);
    let db = getDB();
    let user = db.users.find(u => u.id == id);
    //check if theres a user of that id
    if(!user){
        res.writeHead(404, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: "User not found"}));
        return;
    }
    //delete it and them wallets
    let newdb = {
        users: db.users.filter(u => u.id !== id),
        wallets: db.wallets.filter(w => w.userId !== id)
    }
    fs.writeFileSync(PATH, JSON.stringify(newdb, null, 2));
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify({message: "User deleted successfully"}));
}

//helper functions-----------------------------------------
function getId() {
    let db = getDB();
    if(db.users.length === 0) return 1;
    return db.users[db.users.length - 1].id + 1;
}

const getDB = () => {
    let data = fs.readFileSync(PATH, 'utf-8');
    return JSON.parse(data);
}