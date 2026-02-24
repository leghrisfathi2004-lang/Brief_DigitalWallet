import {addUser, getAllUsers, getUser, deletUser} from '../controllers/users.controller.js'

export const userRt = (req, res) => {

 if(req.method === "POST" && req.url === "/users") {
        return addUser(req, res)
    }

    if(req.method === "GET" && req.url === "/users") {
        return getAllUsers(req, res)
    }

    if(req.method === "GET" && req.url.startsWith("/users/")) {
        return getUser(req, res)
    }

    if(req.method === "DELETE" && req.url.startsWith("/users/")) {
        return deletUser(req,res)
    }
    res.writeHead(404, {"Content-Type": "application/json"});
    res.end(JSON.stringify({message: "Route not found"}));
}
