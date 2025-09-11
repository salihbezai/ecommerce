import cloudinary from "../lib/cloudinary.js"
import { redis } from "../lib/redis.js"
import Product from "../model/product.model.js"

export const getAllProducts = async (req,res)=>{
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.log("Error in getAllProducts controller",error.message)
        res.status(500).json({ message: "Server error",error: error.message });
    }

}

export const getFeaturedProducts = async(req,res)=>{
    try {
      const featuredProducts =   await redis.get("featured_products")
      if(featuredProducts){
        return res.json(JSON.parse(featuredProducts))
      }

      // if not in redis, fetch from mongodb
      // .Lean() returns a plain JS object instead of mongoose document
       

      featuredProducts = await Product.find({ isFeatured:true }).lean()
      if(!featuredProducts){
        return res.status(404).json({ message: "No featured products found" });
      }

      // store in redis for future quick access
      await redis.set("featured_products",JSON.stringify(featuredProducts))

      res.json(featuredProducts)
    } catch (error) {
        console.log("Error in getFeaturedProducts controller",error.message)
        res.status(500).json({ message: "Server error",error: error.message });
    }
}


export const createProduct = async (req,res)=>{
    try {
        const { name, description, price, image, category } = req.body

        let cloudinaryResponse = null;
        if(image){
          cloudinaryResponse =   await cloudinary.uploader.upload(image,{ folder:"products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image:cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })
        res.status(201).json(product)
    } catch (error) {
        console.log("Error in createProduct controller",error.message)
        res.status(500).json({ message: "Server error",error: error.message });
    }
}
