const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token")

	//Check if theres no token
	if(!token) {
		return res.status(401).json({msg: "Unauthorized"})
	}

	//Verify token
	try{
		const decoded = jwt.verify(token, "mysecretkey")
		req.user = decoded.user
		next()
	}catch(err) {
		return res.status(401).json({err})
	}
}
