import { Router } from 'express'
import { addCart, getCart } from './cart.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { validateCart } from '../../helpers/validator.js'

const api = Router()

api.post(
    '/',
    [
        validateJwt,
        validateCart
    ],
    addCart
)

api.get(
    '/:id',
    [
        validateJwt
    ],
    getCart
)

export default api