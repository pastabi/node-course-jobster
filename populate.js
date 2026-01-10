require("dotenv").config();

const jobs = require("./mock-data.json");
const connectDB = require("./db/connect");
const JobModel = require("./models/Job");

const populate = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await JobModel.create(jobs);
    console.log("Jobs successfully populated!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

populate();
