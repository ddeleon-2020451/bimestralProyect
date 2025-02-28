//Rutas de funciones de usuario
import { Router } from 'express'
import { 
    get, 
    getAll, 
    update, 
    deleteUser
} from './user.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

//Rutas privadas
api.get(
    '/',
    [
        validateJwt,
        isAdmin
    ],
    getAll
)

api.get(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    get
)

api.put(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    update
)

api.delete(
    '/:id', 
    [
        validateJwt,
        isAdmin
    ],
    deleteUser
)

/*
    api.put(
        '/:id/password',
        [validateJwt],
        updatePassword
    )
*/
export default api