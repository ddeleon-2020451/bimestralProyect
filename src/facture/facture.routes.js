import { Router } from 'express'
import { addFacture, getFactures, updateFacturePaymentStatus, updateFactureStatus } from './facture.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { validateFacture, validateFactureStatus, validatePaymentStatus } from '../../helpers/validator.js'

const api = Router()

api.post(
    '/',
    [
        validateJwt,
        validateFacture
    ],
    addFacture
)

api.get(
    '/',
    [
        validateJwt
    ],
    getFactures
)

api.put(
    '/:id',
    [
        validateJwt,
        validateFactureStatus
    ],
    updateFactureStatus
)

api.put(
    '/:id',
    [
        validateJwt,
        validatePaymentStatus
    ],
    updateFacturePaymentStatus
)

export default api