require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Connection URL
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = 'car-rental-system'; // This was in your db.js, double check if it's car-rental-system or car_rental_db

// The db.js uses 'car_rental_db' based on previous read. Let's stick to that to be consistent.
// Wait, the previous read of db.js showed: db = client.db("car_rental_db");
const targetDbName = 'car_rental_db';

const client = new MongoClient(uri);

async function seedAdmin() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(targetDbName);
        const collection = db.collection('admins');

        const email = 'admin@example.com';
        const password = 'admin';
        const name = 'Super Admin';

        // Check if admin exists
        const existingAdmin = await collection.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists.');
            // Update password just in case
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await collection.updateOne({ email }, { $set: { password: hashedPassword } });
            console.log('Admin password reset to default.');
        } else {
            console.log('Creating new admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await collection.insertOne({
                name,
                email,
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                createdAt: new Date()
            });
            console.log('Admin created successfully.');
        }

        console.log(`
        Admin Credentials:
        Email: ${email}
        Password: ${password}
        `);

    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        await client.close();
    }
}

seedAdmin();
