import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createCheckoutSession } from "../controllers/payment.controller.js"
import Coupon from "../model/coupon.model.js"
import { stripe } from "../lib/stripe.js"


const router = express.Router()

router.post('/create-checkout-session',protectRoute,createCheckoutSession )


async function createStripeCoupon(discountPercentage){
   const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: 'once',
   })
 return coupon.id
   
}

async function createNewCoupon(userId){
    const newCoupon = new Coupon({
        code: "Gift" + Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage:10,
        expirationDate: new Date(Date.now() + 30*24*60*60*1000), // 30 days from now
        userId: userId
    })
    await newCoupon.save()

    return newCoupon
}