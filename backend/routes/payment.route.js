import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createCheckoutSession } from "../controllers/payment.controller.js"
import Coupon from "../model/coupon.model.js"
import { stripe } from "../lib/stripe.js"


const router = express.Router()

router.post('/create-checkout-session',protectRoute, async (req,res)=>{
    try {
        const { products, couponCode } = req.body

        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({ message: "Products array is required and cannot be empty" })
        }

        let totalAmount = 0;
        const lineItems = products.map(product=>{
            const amount = Math.random(product.price * 100) // stripe wants u to send in the format of cents
            totalAmount += amount * product.quantity

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image],
                },
                unit_amount: amount
            }
        }
        })

        let coupon = null;
        if(couponCode){
            coupon = await Coupon.findOne({ code: couponCode,userId: { $ne: req.user._id }, isActive: true })
            if(coupon){
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100)
            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon 
            ? [
                {
                    coupon: coupon.createStripeCoupon(coupon.discountPercentage)
                }
            ]
            : [],
        })
    } catch (error) {
        
    }
})