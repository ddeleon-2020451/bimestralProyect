//Rutas de autenticacion
import { Router } from 'express'
import { 
    login , 
    register, 
    test
} from './auth.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidator, registerValidator } from '../../helpers/validator.js'

const api = Router()

//Rutas publicas
api.post(
    '/register', 
    [
    registerValidator
    ],
    register
)
api.post(
    '/login', 
    [loginValidator], 
    login
)

//Rutas privadas
                 //middleware
api.get('/test', validateJwt, test)

//Exportar
export default api