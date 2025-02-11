const mongoose = require("mongoose");

const TaxReportSchema = new mongoose.Schema({
    income: {type: Number, required:true},
    deductions: {type: Number, required:true},
    taxPayable: {type: Number, required:true},
    taxRegime: {type: String, enum:["old","new"],required: true},
    createdAt: {type: Date,default: Date.now}
});

module.exports = mongoose.model("TaxReport",TaxReportSchema);
