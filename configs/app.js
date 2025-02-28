//Configurar el servidor de express (http)

//Modular | + efectiva

'use strict'

// ECModules | ESModules
import express from 'express' // Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors'  // Acceso al API
import { limiter } from '../middlewares/rate.limit.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('combined'))
}    

const routes = (app)=>{
    app.use(authRoutes)
    //Buenas prácticass de rutas
                //pre ruta o ruta general
        app.use('/v1/user', userRoutes)
        app.use('/v1/category', categoryRoutes)
} 

//ESModules no acepta exports.
export const initServer = async()=>{
    const app = express() //Instancia de express
    try{
        configs(app) //Aplicar configuraciones al servidor
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}
