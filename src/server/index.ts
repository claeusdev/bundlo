import express from "express";
import morgan from "morgan";
import  cors from "cors";
import { getData } from "./api";

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.get("/search", async (req, res) => {
  const searchTerm = req.query.s;
  try {
    const data = await getData(searchTerm);
    const { meta, sizes } = data;
    if (meta && sizes) {
      return res.status(200).json({ meta, sizes });
    }

    throw "Package not found";
  } catch (error) {
    res.status(400).json({ error: { type: "NotFoundError" } });
  }
});

app.listen(5000, () => {
  console.log("running on 5000");
});
