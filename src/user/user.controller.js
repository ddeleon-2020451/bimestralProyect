//Logica de negocio
import User from "./user.model.js"
import argon2 from "argon2"
import { isValidObjectId } from "mongoose"

export const getAll = async(req, res)=>{
    try{
        const {limit = 20, skip = 0} = req.query
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length === 0) return res.status(404).send(
            {
                message: 'Users not found', succes: false
            }
        )
        return res.send(
            {
                succes: true,
                message: 'Users found: ', 
                users,
                total: users.length
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                message: 'General error', 
                err
            }
        )
    }
}

export const get = async(req, res)=>{
    try{
        const { id } = req.params
        const user = await User.findById(id)

        if(!user) return res.status(400).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User found',
                user
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

// Update
export const update = async(req, res)=>{
    try{
        const { id } = req.params
        let { password, user, role, ...data  } = req.body
        if (!isValidObjectId(id)) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "Invalid ID" 
                }
            )
        }
        const requestingUser = await User.findById(req.userId); 
        if (!requestingUser) {
            return res.status(401).send(
                { 
                    success: false, 
                    message: "Unauthorized" 
                }
            )
        }
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "User not found" 
                }
            )
        }
        if (requestingUser.role === "ADMIN" && userToUpdate.role === "ADMIN") {
            return res.status(403).send(
                { 
                    success: false, 
                    message: "ADMIN cannot update other ADMIN" 
                }
            )
        }
        if (password || user) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "Cannot update password and username" 
                }
            )
        }   
        if(!user) {
            return res.status(400).send(
                {
                    succes: false,
                    message: 'User not found'
                }
            )
        } 
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
        return res.send(
            {
                success: true,
                message: "User updated successfully",
                updatedUser
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

// Update de password 
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { oldPassword, newPassword } = req.body

        // Buscamos el usuario por ID que queremos actulizar la password
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send(
                { 
                    success: false, message: "User not found" 
                }
            )
        }

        // Se verifica si la contraseña es correcta (contraseña actual)
        const isMatch = await argon2.verify(user.password, oldPassword)
        if (!isMatch) {
            return res.status(400).send(
                { 
                    success: false,
                     message: "Current password is incorrect"
                }
            )
        }

        // Encriptamos la nueva contraseña con Argon2
        const hashedPassword = await argon2.hash(newPassword)
        user.password = hashedPassword
        await user.save();

        return res.send(
            { 
                success: true, 
                message: "Password updated successfully" 
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            { 
                success: false, 
                message: "General error", err 
            }
        )
    }
}

// Delete user
export const deleteUser = async(req, res)=>{
    try{
        const { id } = req.params

        // Buscamos el usuario por Id a eliminar
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        const userIdString = user._id.toString()
        const requestingUserIdString = req.user.uid.toString()
        // Evitar que un ADMIN elimine a otro ADMIN
        if (req.user.role === "ADMIN" && user.role === "ADMIN" && requestingUserIdString !== userIdString){
            return res.status(403).send(
                {
                    success: false,
                    message: "Admins cannot delete other admins"
                }
            )
        }

        //Cambiaremos el status del usuario que se va a eliminar
        user.status = false
        await user.save()

        return res.send(
            {
                success: true,
                message: 'User status set to inactive',
            }
        )

    } catch(err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}
