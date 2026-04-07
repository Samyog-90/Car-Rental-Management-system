const { getDB } = require("./db");
const bcrypt = require("bcryptjs");

const seedData = async () => {
    try {
        const db = getDB();

        // Seed Licenses
        const licensesCollection = db.collection("licenses");
        const licenses = [
            { licenseNumber: "01-01-00123445", status: "VALID", holderName: "Ram Bahadur Thapa", expiryDate: "2030-12-31" },
            { licenseNumber: "02-05-99887766", status: "VALID", holderName: "Sita Kumari Sharma", expiryDate: "2028-05-15" },
            { licenseNumber: "03-08-55443322", status: "EXPIRED", holderName: "Hari Krishna Shrestha", expiryDate: "2023-01-01" },
            { licenseNumber: "04-12-11223344", status: "VALID", holderName: "Gopal Prasad Gurung", expiryDate: "2029-11-22" },
            { licenseNumber: "05-10-22334455", status: "VALID", holderName: "Laxmi Devi Adhikari", expiryDate: "2031-01-15" },
            { licenseNumber: "06-02-66778899", status: "VALID", holderName: "Rajesh Hamal", expiryDate: "2032-05-20" }
        ];

        for (const license of licenses) {
            await licensesCollection.updateOne(
                { licenseNumber: license.licenseNumber },
                { $set: license },
                { upsert: true }
            );
        }
        console.log("✅ Mock Licenses Synchronized");

        // Seed NIDs
        const nidsCollection = db.collection("nids");
        const nids = [
            { nidNumber: "123-456-789", fullName: "Ram Bahadur Thapa", address: "Kathmandu-10, Bagmati", dob: "1985-04-12" },
            { nidNumber: "987-654-321", fullName: "Sita Kumari Sharma", address: "Pokhara-06, Gandaki", dob: "1992-08-25" },
            { nidNumber: "111-222-333", fullName: "Hari Krishna Shrestha", address: "Lalitpur-03, Bagmati", dob: "1988-11-30" },
            { nidNumber: "555-666-777", fullName: "Gopal Prasad Gurung", address: "Dharan-15, Koshi", dob: "1990-02-14" },
            { nidNumber: "101-202-303", fullName: "Laxmi Devi Adhikari", address: "Bharatpur-04, Chitwan", dob: "1982-11-05" },
            { nidNumber: "909-808-707", fullName: "Rajesh Hamal", address: "Kathmandu-04, Bagmati", dob: "1964-06-09" }
        ];

        for (const nid of nids) {
            await nidsCollection.updateOne(
                { nidNumber: nid.nidNumber },
                { $set: nid },
                { upsert: true }
            );
        }
        console.log("✅ Mock NIDs Synchronized");

        // Seed Cars
        const carsCollection = db.collection("cars");
        const carsCount = await carsCollection.countDocuments();
        if (carsCount === 0) {
            const cars = [
                {
                    name: "Toyota Corolla",
                    type: "Sedan",
                    price: "Rs. 4,500",
                    priceType: "Per Day",
                    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800",
                    automatic: true,
                    seats: 5,
                    petrol: "Petrol",
                    rating: 4.8,
                    isAvailable: true
                },
                {
                    name: "Hyundai Creta",
                    type: "SUV",
                    price: "Rs. 7,500",
                    priceType: "Per Day",
                    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800",
                    automatic: true,
                    seats: 5,
                    petrol: "Diesel",
                    rating: 4.9,
                    isAvailable: true
                },
                {
                    name: "Suzuki Swift",
                    type: "Hatchback",
                    price: "Rs. 3,500",
                    priceType: "Per Day",
                    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800",
                    automatic: false,
                    seats: 5,
                    petrol: "Petrol",
                    rating: 4.7,
                    isAvailable: true
                },
                {
                    name: "Land Rover Defender",
                    type: "SUV",
                    price: "Rs. 15,000",
                    priceType: "Per Day",
                    image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?q=80&w=800",
                    automatic: true,
                    seats: 7,
                    petrol: "Diesel",
                    rating: 5.0,
                    isAvailable: true
                }
            ];
            await carsCollection.insertMany(cars);
            console.log("✅ Mock Cars Seeded");
        }

        // Seed Admin
        const adminsCollection = db.collection("admins");
        const adminEmail = "admin@example.com";
        const existingAdmin = await adminsCollection.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);
            await adminsCollection.insertOne({
                name: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                createdAt: new Date()
            });
            console.log("✅ Admin Seeded (admin@example.com / admin123)");
        }

        // Seed User
        const usersCollection = db.collection("users");
        const userEmail = "user@example.com";
        const existingUser = await usersCollection.findOne({ email: userEmail });
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("user123", salt);
            await usersCollection.insertOne({
                fullName: "Test User",
                email: userEmail,
                password: hashedPassword,
                role: 'user',
                createdAt: new Date()
            });
            console.log("✅ User Seeded (user@example.com / user123)");
        }

    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

module.exports = { seedData };

