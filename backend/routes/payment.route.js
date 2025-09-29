import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createCheckoutSession } from "../controllers/payment.controller.js"
import Coupon from "../model/coupon.model.js"
import { stripe } from "../lib/stripe.js"


const router = express.Router()

router.post('/create-checkout-session',protectRoute,createCheckoutSession )
router.post('/checkout-success',protectRoute,async (req,res)=>{
    const {sessionId} = req.body
    if(!sessionId) return res.status(400).json({message:"Session ID is required"})
    try {
        const { sessionId } = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if(session.payment_status === 'paid'){
            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                })
                
            }
        }
    } catch (error) {
        console.log("Error in checkout-success route",error.message)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})


export default router