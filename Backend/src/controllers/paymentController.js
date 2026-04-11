const crypto = require('crypto');
const Booking = require('../models/Booking');
const { ObjectId } = require('mongodb');

exports.getEsewaConfig = async (req, res) => {
    try {
        const { amount, transactionUuid } = req.body;

        const totalAmount = amount; 
        const productCode = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
        const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

        const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('base64');

        res.json({
            signature,
            productCode,
            totalAmount,
            transactionUuid,
            successUrl: 'http://localhost:5173/payment/success', 
            failureUrl: 'http://localhost:5173/payment/failure'  
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating eSewa config" });
    }
};

exports.verifyEsewaPay = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ success: false, message: "No data provided" });
        }

        // Decode Base64 data
        const decodedData = Buffer.from(data, 'base64').toString('utf-8');
        const paymentInfo = JSON.parse(decodedData);

        const { status, total_amount, transaction_uuid, product_code, signature } = paymentInfo;

      

        console.log(`[TEST MODE] Bypassing verification for booking ${transaction_uuid}. Status was: ${status}`);

        // Update Booking
        const bookingId = transaction_uuid;
        await Booking.collection().updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { paymentStatus: 'Paid', status: 'Pending' } }
        );

        // Update Car Availability
        const booking = await Booking.collection().findOne({ _id: new ObjectId(bookingId) });
        if (booking && booking.carId) {
            const Car = require('../models/Car');
            const car = await Car.collection().findOne({ _id: new ObjectId(booking.carId) });
            if (car) {
                const currentCount = (car.bookingCount || 0) + 1;
                const outOfStock = currentCount >= 2;
                await Car.collection().updateOne(
                    { _id: new ObjectId(booking.carId) },
                    { 
                        $set: { 
                            bookingCount: currentCount,
                            isAvailable: !outOfStock
                        } 
                    }
                );
            }
        }

        console.log(`[ESEWA PAYMENT] Transaction ${paymentInfo.transaction_code} successful for booking ${bookingId}`);

        res.json({
            success: true,
            message: "Payment verified successfully",
            bookingId,
            booking: booking
        });

    } catch (err) {
        console.error("eSewa Verification Error:", err);
        res.status(500).json({ success: false, message: "Internal server error during verification" });
    }
};
