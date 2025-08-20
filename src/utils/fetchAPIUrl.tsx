import axios from 'axios';

const CONFIG_URL = 'https://raw.githubusercontent.com/aiautoinvoicing/aiautoinvoicing.github.io/refs/heads/main/config/aai.json';
const DEFAULT_API_URL = 'https://xai34130.ddns-ip.net:8080/aai/image_invoice_json';
// https://xai34130.ddns-ip.net:8000/

export const fetchAPIUrl = async () => {
    try {
        const configRes = await axios.get(CONFIG_URL);
        console.log("Fetched config:", configRes.data);

        const apiBase = configRes.data?.aiai_api_url;
        if (typeof apiBase === 'string' && apiBase.length > 0) {
            // const apiUrl = invoiceApiBase + 'aiai/image_invoice_json';
            // console.log("Using API URL from config:", apiUrl);
            return apiBase;
        } else {
            throw new Error("Invalid or missing invoice_api_url in config");
        }
    } catch (err) {
        console.warn("Failed to fetch config, falling back to default API URL:", err);
        return DEFAULT_API_URL;
    }
};
