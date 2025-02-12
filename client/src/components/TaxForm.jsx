
import React, { useState } from "react";
import { Calculator, Coins, TrendingUp, HelpCircle, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import debounce from "lodash.debounce";
const BASE_URL = process.env.REACT_APP_API_URL;

const TaxForm = () => {
  const [income, setIncome] = useState(0);
  const [section80C, setSection80C] = useState(0);
  const [section80D, setSection80D] = useState(0);
  const [hra, setHra] = useState(0);
  const [taxRegime, setTaxRegime] = useState("old");
  const [taxResult, setTaxResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleIncomeChange = debounce((value) => {
    setIncome(Math.max(0, Number(value)));
  }, 300);

  const handleSection80CChange = debounce((value) => {
    setSection80C(Math.max(0, Number(value)));
  }, 300);

  const handleSection80DChange = debounce((value) => {
    setSection80D(Math.max(0, Number(value)));
  }, 300);

  const handleHraChange = debounce((value) => {
    setHra(Math.max(0, Number(value)));
  }, 300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Construct deductions object to send separate values
    const deductions = {
        section80C,
        section80D,     // Employer NPS contribution
        hra,               // House Rent Allowance (if applicable)
    };

    try {
        const response = await axios.post(`${BASE_URL}/api/tax/calculate`, {
            income,
            deductions,  // Send structured deductions object
            taxRegime,
        });
        
        
        setTaxResult(response.data);
    } catch (error) {
        console.error("Error calculating tax:", error);
        setError("An error occurred while calculating tax. Please try again.");
    } finally {
        setIsLoading(false);
    }
};

  
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-r from-blue-50 to-purple-50"} py-8`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg"
      >
        {isDarkMode ? <Moon className="w-6 h-6 text-gray-800" /> : <Sun className="w-6 h-6 text-yellow-500" />}
      </button>

      {/* Hero Section */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-blue-600"} text-white py-12`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Income Tax Calculator</h1>
          <p className="text-lg mb-6">Calculate your income tax under both old and new regimes in just a few clicks!</p>
          {/* <img
            src="/tax.avif"
            alt="Tax Calculator"
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          /> */}
        </div>
      </div>

      {/* Form Section */}
      <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-lg mt-8`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Income Input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>Annual Income</label>
              <HelpCircle
                className="w-4 h-4 text-gray-400 cursor-help"
                data-tooltip-id="income-tooltip"
              />
              <Tooltip id="income-tooltip" place="right" content="Enter your total annual income before any deductions" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                onChange={(e) => handleIncomeChange(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-800 text-gray-200" : "border-gray-300 bg-white text-gray-800"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          {/* Section 80C Input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>Section 80C</label>
              <HelpCircle
                className="w-4 h-4 text-gray-400 cursor-help"
                data-tooltip-id="80c-tooltip"
              />
              <Tooltip id="80c-tooltip" place="right" content="Enter deductions under Section 80C (e.g., EPF, PPF, ELSS)" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                onChange={(e) => handleSection80CChange(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-800 text-gray-200" : "border-gray-300 bg-white text-gray-800"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          {/* Section 80D Input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>Section 80D</label>
              <HelpCircle
                className="w-4 h-4 text-gray-400 cursor-help"
                data-tooltip-id="80d-tooltip"
              />
              <Tooltip id="80d-tooltip" place="right" content="Enter deductions under Section 80D (Health Insurance Premium)" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                onChange={(e) => handleSection80DChange(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-800 text-gray-200" : "border-gray-300 bg-white text-gray-800"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          {/* HRA Input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>HRA</label>
              <HelpCircle
                className="w-4 h-4 text-gray-400 cursor-help"
                data-tooltip-id="hra-tooltip"
              />
              <Tooltip id="hra-tooltip" place="right" content="Enter House Rent Allowance (HRA)" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                onChange={(e) => handleHraChange(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-800 text-gray-200" : "border-gray-300 bg-white text-gray-800"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          {/* Tax Regime */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>Tax Regime</label>
              <HelpCircle
                className="w-4 h-4 text-gray-400 cursor-help"
                data-tooltip-id="regime-tooltip"
              />
              <Tooltip id="regime-tooltip" place="right" content="Choose between old regime (with deductions) or new regime (without deductions but lower rates)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTaxRegime("old")}
                aria-label="Select Old Tax Regime"
                className={`p-3 rounded-lg border transition-all ${taxRegime === "old"
                  ? `${isDarkMode ? "bg-blue-800 border-blue-700 text-blue-200" : "bg-blue-50 border-blue-500 text-blue-700"}`
                  : `${isDarkMode ? "border-gray-600 text-gray-200 hover:border-gray-500" : "border-gray-300 text-gray-700 hover:border-gray-400"}`
                }`}
              >
                Old Regime
              </button>
              <button
                type="button"
                onClick={() => setTaxRegime("new")}
                aria-label="Select New Tax Regime"
                className={`p-3 rounded-lg border transition-all ${taxRegime === "new"
                  ? `${isDarkMode ? "bg-blue-800 border-blue-700 text-blue-200" : "bg-blue-50 border-blue-500 text-blue-700"}`
                  : `${isDarkMode ? "border-gray-600 text-gray-200 hover:border-gray-500" : "border-gray-300 text-gray-700 hover:border-gray-400"}`
                }`}
              >
                New Regime
              </button>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                Calculate Tax
              </>
            )}
          </button>
        </form>

        {/* Tax Result */}
        {taxResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mt-6 p-6 ${isDarkMode ? "bg-green-900 border-green-700" : "bg-green-50 border-green-200"} rounded-lg border`}
          >
            <div className="text-center">
              <h3 className={`text-lg font-medium ${isDarkMode ? "text-green-200" : "text-green-800"} mb-2`}>Tax Calculation Result</h3>
              <p className={`text-3xl font-bold ${isDarkMode ? "text-green-300" : "text-green-700"}`}>
                ₹{taxResult.taxPayable?.toLocaleString()}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-600"} mt-1`}>Estimated tax payable</p>
            </div>
            <div className="mt-4 text-left">
              <p className={isDarkMode ? "text-gray-200" : "text-gray-700"}><strong>Taxable Income:</strong> ₹{taxResult.taxableIncome?.toLocaleString()}</p>
              <p className={isDarkMode ? "text-gray-200" : "text-gray-700"}><strong>Rebate:</strong> ₹{taxResult.rebate?.toLocaleString()}</p>
              <p className={isDarkMode ? "text-gray-200" : "text-gray-700"}><strong>Surcharge:</strong> ₹{taxResult.surcharge?.toLocaleString()}</p>
              <p className={isDarkMode ? "text-gray-200" : "text-gray-700"}><strong>Cess:</strong> ₹{taxResult.cess?.toLocaleString()}</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mt-6 p-6 ${isDarkMode ? "bg-red-900 border-red-700" : "bg-red-50 border-red-200"} rounded-lg border`}>
            <p className={isDarkMode ? "text-red-200" : "text-red-700"}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxForm;