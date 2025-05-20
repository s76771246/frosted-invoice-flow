// Environment configuration
const env = {
  // External API endpoint for invoice data
  API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || "https://v3poc.lightinfosys.com/external_api/invoice_view",
  
  // Other environment configs can be added here
  DEBUG: import.meta.env.DEV === true,
  VERSION: "1.0.0"
};

export default env;
