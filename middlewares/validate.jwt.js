import jwt from 'jsonwebtoken';
import User from "../src/user/user.model.js";

export const validateJwt = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.replace(/^Bearer\s+/, "")

        if (!token) {
            return res.status(400).json(
                {
                    success: false,
                    message: "No token provided in the request"
                }
            )
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(uid)

        if (!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: "User does not exist in DB"
                }
            )
        }

        if (user.status === false) {
            return res.status(400).json(
                {
                    success: false,
                    message: "User has been deactivated"
                }
            )
        }
        req.user = user
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json(
            {
                success: false,
                message: "Error validating the token",
            }
        )
    }
}
