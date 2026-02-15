const crypto = require('crypto');

exports.getEsewaConfig = async (req, res) => {
    try {
        const { amount, transactionUuid } = req.body;

        const totalAmount = amount; // Assuming no tax/service charge for simplicity
        const productCode = 'EPAYTEST';
        const secretKey = '8gBm/:&EnhH.1/q';

        // Signature generation: "total_amount,transaction_uuid,product_code"
        const signatureString = `${totalAmount},${transactionUuid},${productCode}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('base64');

        res.json({
            signature,
            productCode,
            totalAmount,
            transactionUuid,
            successUrl: 'http://localhost:5173/payment/success', // Frontend success route
            failureUrl: 'http://localhost:5173/payment/failure'  // Frontend failure route
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating eSewa config" });
    }
};
