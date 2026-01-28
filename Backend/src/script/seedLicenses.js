require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

const names = [
  "Ram", "Shyam", "Hari", "Gopal", "Sita", "Gita", "Laxmi", "Bishnu",
  "Krishna", "Ramesh", "Suresh", "Dinesh", "Mahesh", "Nabin", "Anil",
  "Sunil", "Puja", "Nisha", "Sabin", "Prakash"
];

function randomDate(startYear, endYear) {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  return new Date(`${year}-01-01`);
}

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("car_rental_db");

  const licenses = [];

  for (let i = 1; i <= 100; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    licenses.push({
      licenseNumber: `DL-NEP-${100000 + i}`,
      holderName: `${name} Sharma`,
      status: i % 5 === 0 ? "EXPIRED" : "VALID",
      expiryDate: i % 5 === 0 ? randomDate(2015, 2022) : randomDate(2026, 2032),
      issuedCountry: "Nepal",
      createdAt: new Date()
    });
  }

  await db.collection("licenses").insertMany(licenses);
  console.log("100 Nepalese licenses inserted successfully");

  await client.close();
}

seed().catch(console.error);
