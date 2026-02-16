const { getDB } = require("./db");

const seedData = async () => {
    try {
        const db = getDB();

        // Seed Licenses
        const licensesCollection = db.collection("licenses");
        const licenseCount = await licensesCollection.countDocuments();

        if (licenseCount === 0) {
            const licenses = [
                { licenseNumber: "01-01-00123445", status: "VALID", holderName: "Ram Bahadur Thapa", expiryDate: "2030-12-31" },
                { licenseNumber: "02-05-99887766", status: "VALID", holderName: "Sita Kumari Sharma", expiryDate: "2028-05-15" },
                { licenseNumber: "03-08-55443322", status: "EXPIRED", holderName: "Hari Krishna Shrestha", expiryDate: "2023-01-01" },
                { licenseNumber: "04-12-11223344", status: "VALID", holderName: "Gopal Prasad Gurung", expiryDate: "2029-11-22" }
            ];
            await licensesCollection.insertMany(licenses);
            console.log("✅ Seeded Licenses with Nepali names");
        }

        // Seed NIDs
        const nidsCollection = db.collection("nids");
        const nidCount = await nidsCollection.countDocuments();

        if (nidCount === 0) {
            const nids = [
                { nidNumber: "123-456-789", fullName: "Ram Bahadur Thapa", address: "Kathmandu-10, Bagmati", dob: "1985-04-12" },
                { nidNumber: "987-654-321", fullName: "Sita Kumari Sharma", address: "Pokhara-06, Gandaki", dob: "1992-08-25" },
                { nidNumber: "111-222-333", fullName: "Hari Krishna Shrestha", address: "Lalitpur-03, Bagmati", dob: "1988-11-30" },
                { nidNumber: "555-666-777", fullName: "Gopal Prasad Gurung", address: "Dharan-15, Koshi", dob: "1990-02-14" }
            ];
            await nidsCollection.insertMany(nids);
            console.log("✅ Seeded NIDs with Nepali names");
        }

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
};

module.exports = { seedData };
