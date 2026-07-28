import "dotenv/config";
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js'

// Read the tocken from the request
// Check if toeken is valid
export const authMiddleware = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1] // ["Bearer", "token"]
    } 
    else if(req.cookie?.jwt) {
        token = req.cookie.jwt
    } 

    if(!token){
        return res.status(401).json({
            error: "Not Autorized"
        })
    }

    try {
        // Verify the token is valid and extract user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
            where: {id: decoded.id}
        })
        if (!user){
            return res.status(401).json({
            error: "User no longer exists"
        })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({
            error: "Not authorized, token failed"
        })
    }
}

export default authMiddleware