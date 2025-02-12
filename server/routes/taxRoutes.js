const express = require("express");
const TaxReport = require("../models/TaxReport");
const router = express.Router();

const OLD_REGIME_SLABS = [
    { limit: 250000, rate: 0 },
  { limit: 300000, rate: 0 },
  { limit: 500000, rate: 5 },
  { limit: 600000, rate: 5 },
  { limit: 700000, rate: 5 },
  { limit: 900000, rate: 10 },
  { limit: 1000000, rate: 10 },
  { limit: 1200000, rate: 15 },
  { limit: 1250000, rate: 20 },
  { limit: 1500000, rate: 20 },
  { limit: Infinity, rate: 30 },
];

const NEW_REGIME_SLABS = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 5 },
    { limit: 1200000, rate: 10 },
    { limit: 1600000, rate: 15 },
    { limit: 2000000, rate: 20 },
    { limit: 2400000, rate: 25 },
    { limit: Infinity, rate: 30 },
];

// Function to calculate tax
const calculateTax = (income, slabs) => {
  let tax = 0;
  let prevLimit = 0;

  for (const slab of slabs) {
    if (income > slab.limit) {
      tax += (slab.limit - prevLimit) * (slab.rate / 100);
      prevLimit = slab.limit;
    } else {
      tax += (income - prevLimit) * (slab.rate / 100);
      break;
    }
  }
  return tax;
};

// Function to calculate surcharge
const calculateSurcharge = (taxableIncome, tax) => {
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
    return tax * 0.1; // 10% surcharge
  } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
    return tax * 0.15; // 15% surcharge
  } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
    return tax * 0.25; // 25% surcharge
  } else if (taxableIncome > 50000000) {
    return tax * 0.37; // 37% surcharge
  }
  return 0;
};

// Function to calculate health and education cess
const calculateCess = (tax, surcharge) => {
  return (tax + surcharge) * 0.04; // 4% cess
};
const calculateRebate = (taxableIncome, tax) => {
  return taxableIncome <= 1200000 ? Math.min(tax, 60000) : 0;
};


router.post("/calculate", async (req, res) => {
  try {
      const { income, deductions = {}, taxRegime } = req.body;
      if (!income || !taxRegime) {
          return res.status(400).json({ error: "Income and tax regime are required." });
      }
      
      // Calculate standard deduction (₹75,000)
      let totalDeductions = taxRegime === "old" ? 50000 : 75000;

      
      // Section 80C (Max ₹1,50,000)
      totalDeductions += Math.min(deductions.section80C || 0, 150000);
      
      // Section 80D (Max 75,000)
      totalDeductions += Math.min(deductions.section80D || 0, 75000); // Maximum combined limit
      
      totalDeductions += Math.min(deductions.hra || 0, income*0.5);
      
      // Calculate taxable income
      const taxableIncome = Math.max(income - totalDeductions, 0);
      
      // Calculate tax based on regime
      const slabs = taxRegime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
      let tax = calculateTax(taxableIncome, slabs);
      
      // Apply rebate
      const rebate = calculateRebate(taxableIncome, tax);
      tax -= rebate;
      
      // Apply surcharge
      const surcharge = calculateSurcharge(taxableIncome, tax);
      tax += surcharge;
      
      // Apply cess
      const cess = calculateCess(tax, surcharge);
      tax += cess;
      
      // Save tax report
      const taxReport = new TaxReport({
          income,
          deductions,
          taxableIncome,
          taxPayable: tax,
          taxRegime,
      });
      await taxReport.save();

      res.json({ income, deductions, taxableIncome, taxPayable: tax, taxRegime, rebate, surcharge, cess });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get("/reports", async (req, res) => {
  try {
      const reports = await TaxReport.find().sort({ createdAt: -1 });
      res.json(reports);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
