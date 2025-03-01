//VALIDAR CAMPOS EN LAS RUTAS
import { body } from "express-validator"
import { validateErrors } from "./validate.errors.js"
import { existUsername, existCategory } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name is required').notEmpty(),
    body('surname', 'Surname is required').notEmpty(),
    body('email', 'Email is required or is not a valid email').notEmpty().isEmail(),
    body('phone', 'Phone is required or is not a valid phone').notEmpty().isMobilePhone(),
    body('username', 'Username is required').notEmpty().isLowercase().custom(existUsername),
    body('password', 'Password is required').notEmpty().isStrongPassword().withMessage('Please write a stronger password').isLength({min: 8}),
    validateErrors
]

export const loginValidator = [
    body('userLoggin', 'Username or email is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
    validateErrors
]

export const validateAddCategory = [
    body('name', 'Name is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    validateErrors
]

export const validateProduct = [
    body('name', 'Name is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('price', 'Price is required').isNumeric().isFloat(),
    body('stock', 'Scotk of product is required').isNumeric().isInt(),
    body('category', 'Category ID is required and valid').notEmpty().custom(existCategory)
]