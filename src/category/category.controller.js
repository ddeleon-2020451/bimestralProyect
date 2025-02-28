import Category from './category.model.js'

export const defaultCategory = async()=>{
        let defaultCategory = await Category.findOne({name: "Uncategorized"})
        if(!defaultCategory){
            defaultCategory = new Category(
                {
                    name: "Uncategorized",
                    description: "Categoría por defecto para los productos",
                    status: true
                }
            )
            await defaultCategory.save()
        }
        return defaultCategory._id
}

export const addCategory = async(req, res)=>{
    try{
        let data = req.body
        const existCategory = await Category.findOne(
            {
                name: data.name
            }
        )
        if(existCategory)
            return res.status(400).send(
            {
                succes: false,
                message: "Category already exists"
            }
        )
        const Category =  new Category(data)
        await Category.save()
        return res.status(201).send(
            {
                succes: true,
                message: 'Categoy added successfully'
            }
        )
    }catch(err){
        return res.status(500).send(
            {
                succes: false,
                message: 'Error when adding Category',
                err
            }
        )
    }
}