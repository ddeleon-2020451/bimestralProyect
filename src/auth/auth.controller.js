// Logica de autenticacion
import User from "../user/user.model.js"
import { checkPassword, encrypt } from "../../utils/encrypt.js"
import { generateJwt } from "../../utils/jwt.js"

// Test
export const test = (req, res) => {
    console.log("Test is running")
    return res.send({ message: "Test is running" })
};

// Register
export const register = async (req, res) => {
    try {
        // Capturar los datos
        let data = req.body

        // Verificar si el email ya está en uso antes de guardar
        const existingUser = await User.findOne({ email: data.email })
        if (existingUser) {
            return res.status(400).send({ message: "Email already in use" })
        }

        // Encriptar la contraseña antes de guardarla
        data.password = await encrypt(data.password)

        // Asignar rol por defecto si no se especifica
        if (!data.role || !["ADMIN", "CLIENT"].includes(data.role.toUpperCase())) {
            data.role = "CLIENT"
        }

        let user = new User(data)
        await user.save()

        return res.send({ message: `Registered successfully, can be logged with username: ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: "General error with registering user", err })
    }
};

// Login
export const login = async (req, res) => {
    try {
        // Capturar los datos (body)
        let { userLoggin, password } = req.body;

        // Validar que el usuario exista
        let user = await User.findOne({
            $or: [{ email: userLoggin }, { username: userLoggin }],
        });

        if (!user) {
            return res.status(400).send({ message: "Wrong email or password" })
        }

        // Verificar que la contraseña coincida
        if (!(await checkPassword(password, user.password))) {
            return res.status(400).send({ message: "Wrong email or password" })
        }

        // Generar token JWT con información segura
        let loggedUser = {
            uid: user._id,
            name: user.name,
            username: user.username,
            role: user.role,
            iat: Math.floor(Date.now() / 1000), // Tiempo de emisión
        };

        let token = await generateJwt(loggedUser)

        // Responder al usuario
        return res.send({
            message: `Welcome ${user.name}`,
            loggedUser,
            token,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "General error with login function" });
    }
}
