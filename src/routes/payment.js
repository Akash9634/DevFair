const express = require("express");
const userAuth  = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const order = await razorpayInstance.orders.create({ //this will return a promise
      amount: 500000,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: "value3",
        lastName: "value2",
        membershipType: "silver",
      }
    });
    
    //save it in database
    console.log(order);

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    //return back my order details to frontend
    res.json({ ...savedPayment.toJSON() }); 
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = paymentRouter;
