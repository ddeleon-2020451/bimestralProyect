'use strict'
import { hash, verify } from 'argon2'

//Encriptar
export const encrypt = async(password)=>{
    try {
        return await hash(password)
    } catch (e) {
        console.error(e)
        return e
    }
}

export const checkPassword = async(password, hash)=>{
    try {
        return await verify(hash, password)
    } catch (e) {
        console.error(e)
        return e
    }
}