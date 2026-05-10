const mongoose = require('mongoose');

const uri = "mongodb+srv://shantanu:shantanu@cluster0.tenroni.mongodb.net/shadeandcorp?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
    try {
        console.log("Attempting to connect to MongoDB Atlas using Mongoose...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, 
        });
        console.log("Successfully connected to MongoDB Atlas!");
        
        const dbName = mongoose.connection.name;
        console.log("Connected to database:", dbName);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        
    } catch (err) {
        console.error("Connection failed!");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        console.error("Error Stack:", err.stack);
        
        if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')) {
            console.error("\n[DEDUCTION] IP Whitelisting issue detected. Please go to MongoDB Atlas -> Network Access and add your current IP address.");
        }
    } finally {
        await mongoose.disconnect();
    }
}

testConnection();
