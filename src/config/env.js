
// Environment configuration
const env = {
  // External API endpoint for invoice data
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT || "https://v3poc.lightinfosys.com/external_api/invoice_view",
  
  // Other environment configs can be added here
  DEBUG: process.env.NODE_ENV === "development",
  VERSION: "1.0.0"
};

export default env;
