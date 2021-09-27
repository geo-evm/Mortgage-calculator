const express = require("express");
const path = require("path");
const { v4 } = require("uuid");
const app = express();

let BANKS = [
  {
    id: v4(),
    bank_name: "Privat",
    interest_rate: "14",
    maximum_loan: "300000",
    minimum_down_payment: "20",
    loan_term: "24"
  }
];

app.use(express.json());

// GET
app.get("/api/banks", (req, res) => {
    res.status(200).json(BANKS);
});

// POST
app.post("/api/banks", (req, res) => {
  const bank = { ...req.body, id: v4() };
  BANKS.push(bank);
  res.status(201).json(bank);
});

// DELETE
app.delete("/api/banks/:id", (req, res) => {
  BANKS = BANKS.filter((c) => c.id !== req.params.id);
  res.status(200).json({ message: "Bank is deleted" });
});

// PUT
app.put("/api/banks/:id", (req, res) => {
  const idx = BANKS.findIndex((c) => c.id === req.params.id);
  BANKS[idx] = req.body;
  res.json(BANKS[idx]);
});

app.use(express.static(path.resolve(__dirname, "client")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

app.listen(3000, () => console.log("Server has been started on port 3000..."));
