const { getDB } = require("./db");

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

    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

module.exports = { seedData };
