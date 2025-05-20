
// Environment configuration
const env = {
  // Replace this with your actual API endpoint where your Python MongoDB API is hosted
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000/api/invoices",
  
  // Other environment configs can be added here
  DEBUG: process.env.NODE_ENV === "development",
  VERSION: "1.0.0"
};

export default env;
