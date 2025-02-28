//Limitar la cantidad de solicitudes en cierto tiempo
import rateLimit from "express-rate-limit"

export const limiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000, //rango de tiempo
        max: 100,
        message: {
            message: "You're blocked, wait 15 minutes"
        }
    }
)