const { connectDB, getDB } = require("c:\\Users\\Samyog Jung Basnet\\car-rental-management-system\\Backend\\src\\config\\db");
require("dotenv").config({ path: "c:\\Users\\Samyog Jung Basnet\\car-rental-management-system\\Backend\\.env" });

async function check() {
    try {
        await connectDB();
        const db = getDB();
        const users = await db.collection("users").find({}).toArray();
        console.log("Total Users in collection:", users.length);
        const admin = users.find(u => u.email.toLowerCase() === "admin@example.com");
        console.log("Admin details:", admin ? { email: admin.email, role: admin.role, hasPassword: !!admin.password } : "NOT FOUND");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
