import { Router } from 'express'
import { addProduct, deleteProduct, getProduct, updateProduct } from './product.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { validateProduct } from '../../helpers/validator.js'

const api = Router()

api.post(
    '/',
    [
        validateJwt,
        validateProduct,
        isAdmin
    ],
    addProduct
)

api.get(
    '/',
    [
        validateJwt,
    ],
    getProduct
)

api.put(
    '/:id',
    [
        validateJwt,
        validateProduct
    ],
    updateProduct
)

api.delete(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteProduct
)
export default api