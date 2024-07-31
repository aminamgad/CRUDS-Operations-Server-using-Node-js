const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1]; // Splitting correctly on space
    }
    if (!token) {
        return res.status(400).json({ error: "Invalid Token" }); // Return to stop further execution
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Not authorized, token failed' }); // Return to stop further execution
    }
};

exports.admin = async (req,res,next) =>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({err:"Only Admins"})
    }
}