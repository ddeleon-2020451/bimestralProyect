//MODELO DE PRODUCTO
import { Schema, model } from "mongoose"

const productSchema = Schema(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`]
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [100, `Can't be overcome 100 characters`],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0.01, "Price must be greater than 0"],
        },
        stock: {
            type: Number,
            required: [true, "Stock is required"],
            min: [1, "Stock cannot be negative"],
            default: 0,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        bestseller: {
            type: Boolean,
            default: false,
        },
        status: {
            type: Boolean,
            default: true,
        }
    }
)

productSchema.methods.toJSON = function () {
    const { __v, ...product } = this.toObject()
    return product
}

export default model("Product", productSchema)