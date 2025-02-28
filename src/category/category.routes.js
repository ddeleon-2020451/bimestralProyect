import { Router } from 'express'
import { addCategory, deleteCategory, getCategory, updateCategory } from './category.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { validateAddCategory } from '../../helpers/validator.js'

const api = Router()

api.post(
    '/',
    [
        validateJwt,
        isAdmin,
        validateAddCategory
    ],
    addCategory
)

api.get(
    '/',
    [
        validateJwt,
        isAdmin
    ],
    getCategory
)

api.put(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    updateCategory
)

api.delete(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteCategory
)
export default api