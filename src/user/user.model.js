//MODELO DE USUARIO
import { Schema, model } from "mongoose"

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`] 
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't be overcome 25 characters`]
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [9, `Can't be overcome 9 numbers`],
            minLength: [8, 'Number must be 8 numbers']
        },
        username: {
            type: String,
            unique: true,
            required: [true, 'Username is required'],
            maxLength: [15, `Can't be overcome 15 characters`]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characters'],
            maxLength: [100, `Can't be overcome 16 characters`],
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['ADMIN', 'CLIENT'],
            default: 'client'
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

//Modificar el JSON para excluir datos en la respuesta
userSchema.methods.toJSON = function(){
    const { __v, password, ...user} = this.toObject() //Sirve para convertir un documento de MongoDB a Objeto de JavaScript
    return user
}

//Crear y exportar el modelo
export default model('User', userSchema)
