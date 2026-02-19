const crypto = require('crypto');
const Booking = require('../models/Booking');
const { ObjectId } = require('mongodb');


const validateLuhn = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
};

exports.getEsewaConfig = async (req, res) => {
    try {
        const { amount, transactionUuid } = req.body;

        const totalAmount = amount; 
        const productCode = 'EPAYTEST';
        const secretKey = '8gBm/:&EnhH.1/q';

       
        const signatureString = `${totalAmount},${transactionUuid},${productCode}`;
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

exports.mockCardPay = async (req, res) => {
    try {
        const { cardNumber, expiryDate, cvv, cardHolderName, bookingId, amount } = req.body;

        
        const cleanCardNumber = String(cardNumber).replace(/\s/g, '');

       
        if (!/^\d{16}$/.test(cleanCardNumber)) {
            return res.status(400).json({ success: false, message: "Payment failed: Card number must be 16 digits" });
        }

        
        if (!validateLuhn(cleanCardNumber)) {
            return res.status(400).json({ success: false, message: "Payment failed: Invalid card number (Luhn check failed)" });
        }

        
        if (!/^\d{3}$/.test(cvv)) {
            return res.status(400).json({ success: false, message: "Payment failed: CVV must be exactly 3 digits" });
        }

        
        if (!cardHolderName || cardHolderName.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Payment failed: Invalid cardholder name" });
        }

        
        const expiryMatch = expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
        if (!expiryMatch) {
            return res.status(400).json({ success: false, message: "Payment failed: Invalid expiry date format (MM/YY)" });
        }

        const [_, month, year] = expiryMatch;
        const expiryDateObj = new Date(parseInt(`20${year}`), parseInt(month) - 1);
        const now = new Date();
        if (expiryDateObj < new Date(now.getFullYear(), now.getMonth())) {
            return res.status(400).json({ success: false, message: "Payment failed: Card has expired" });
        }

       
        if (bookingId) {
            await Booking.collection().updateOne(
                { _id: new ObjectId(bookingId) },
                { $set: { paymentStatus: 'Paid', status: 'Pending' } }
            );
        }

        
        const transactionId = `TXN-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
        const last4Digits = cleanCardNumber.slice(-4);

       
        console.log(`[MOCK PAYMENT] Transaction ${transactionId} successful for booking ${bookingId}`);

        res.json({
            success: true,
            transactionId,
            last4Digits,
            bookingId,
            amount,
            message: "Payment successful"
        });

    } catch (err) {
        console.error("Card Payment Error:", err);
        res.status(500).json({ success: false, message: "Payment failed: Internal server error" });
    }
};
