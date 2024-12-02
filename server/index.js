import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/dbConfig.js";
import userRoutes from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import recipeRoute from "./routes/recipeRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import favoriteRoute from "./routes/favoriteRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import adminRoute from "./routes/adminReviewRoute.js";
import contactRoute from "./routes/contactRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoute);
app.use("/users", userRoutes);
app.use("/recipe", recipeRoute);
app.use("/category", categoryRoute);
app.use("/favorite", favoriteRoute);
app.use("/review", reviewRoute);
app.use("/admin", adminRoute);
app.use("/contact", contactRoute); // Use /contact for simplicity

// Static folder for images
app.use('/images', express.static('images'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
