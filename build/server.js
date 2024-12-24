"use strict";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3e3;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
