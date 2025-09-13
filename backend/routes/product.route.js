import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getRecommendedProducts, toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import express from "express"

const router = express.Router()

router.get('/',protectRoute,adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/recommendations',protectRoute,getRecommendedProducts)
router.post("/",protectRoute,adminRoute,createProduct)
router.patch("/:id",protectRoute,adminRoute,toggleFeaturedProduct)
router.delete("/:id",protectRoute,adminRoute,deleteProduct)


export default router;