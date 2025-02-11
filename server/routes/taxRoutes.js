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

// function to calculate tax
const calculateTax = (income,slabs)=>{
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

//API to calculate tax
router.post("/calculate", async(req,res)=>{
    try{
        const {income,deductions,taxRegime} = req.body;
        
        if(!income || !taxRegime){
            return res.status(400).json({error: "Income and tax regime are required."})
        }

        const taxableIncome = income - (deductions || 0);
        const slabs = taxRegime === "old" ? OLD_REGIME_SLABS: NEW_REGIME_SLABS;
        const taxPayable = calculateTax(taxableIncome,slabs);

        const taxReport = new TaxReport({income,deductions,taxPayable,taxRegime});
        await taxReport.save();

        res.json({income,deductions,taxPayable,taxRegime});
    }catch(error){
        res.status(500).json({error: error.message})
    }
});

//API to get all tax Reports
router.get("/reports", async (req, res) => {
    try {
      const reports = await TaxReport.find().sort({ createdAt: -1 });
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;

