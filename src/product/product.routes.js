import { Router } from 'express'
import { addProduct, deleteProduct, getProduct, updateProduct, getProductId } from './product.controller.js'
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

api.get(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    getProductId
)

api.put(
    '/:id',
    [
        validateJwt,
        validateProduct,
        isAdmin
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