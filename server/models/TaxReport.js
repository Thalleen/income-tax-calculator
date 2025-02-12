const mongoose = require("mongoose");

const TaxReportSchema = new mongoose.Schema({
    income: { type: Number, required: true },
    deductions: { type: mongoose.Schema.Types.Mixed, default: {} },  // ✅ Allows storing an object
    taxRegime: { type: String, required: true },
    createdAt: {type: Date,default: Date.now}
});

module.exports = mongoose.model("TaxReport",TaxReportSchema);
