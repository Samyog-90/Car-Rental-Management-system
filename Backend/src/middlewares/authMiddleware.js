const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        req.user = decoded;
        req.admin = decoded; // For compatibility
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};


module.exports = verifyToken;
module.exports.verifyToken = verifyToken;
module.exports.isAdmin = isAdmin;
module.exports.authMiddleware = verifyToken;


