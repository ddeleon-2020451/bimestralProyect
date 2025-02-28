//MODELO DE CATEGORIA
import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            maxLength: [50, `Can't be overcome 50 characters`],
        },
        description: {
            type: String,
            maxLength: [100, `Can't be overcome 100 characters`],
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
)

categorySchema.methods.toJSON = function () {
    const { __v, ...category } = this.toObject()
    return category
}

export default model("Category", categorySchema)
