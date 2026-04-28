const express = require("express");
const dns = require("dns");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://crm-ak7v.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);)
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));

app.use("/api/enquiries", require("./src/routes/enquiryRoutes"));
app.use("/api/followups", require("./src/routes/followUpRoutes"));

app.use("/api/students", require("./src/routes/studentRoutes"));

app.use("/api/courses", require("./src/routes/courseRoutes"));
app.use("/api/batches", require("./src/routes/batchRoutes"));

app.use("/api/payments", require("./src/routes/paymentRoutes"));

function configureMongoDns(uri) {
    if (!uri || !uri.startsWith("mongodb+srv://")) {
        return;
    }

    const configuredServers =
        process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1";
    const servers = configuredServers
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (servers.length > 0) {
        dns.setServers(servers);
        console.log(`Using DNS servers for MongoDB SRV lookup: ${servers.join(", ")}`);
    }
}

async function startServer() {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in backend/.env");
        }

        configureMongoDns(mongoUri);

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("MongoDB Connected");
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (err) {
        if (err.code === "ECONNREFUSED" && err.syscall === "querySrv") {
            console.error(
                "MongoDB SRV lookup failed. The backend is now configured to use custom DNS resolvers. " +
                    "If this still happens, replace MONGO_URI with Atlas's non-SRV mongodb:// connection string."
            );
        }

        console.error(err);
        process.exit(1);
    }
}

startServer();
