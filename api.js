const axios = require("axios");

async function getDetails(url) {
    try {
        const response = await axios.get(`https://true12g.in/api/teraboxSwastik.php?url=${url}`);
        
        if (response.data.status === "Success") {
            const data = response.data.response[0];
            return {
                title: data.title,
                size: data.size,
                thumbnail: data.thumbnail,
                resolutions: data.resolutions
            };
        } else {
            console.error("Failed to fetch details. Response status:", response.data.status);
            return null;
        }
    } catch (error) {
        console.error("Error fetching details:", error.message);
    }
}

module.exports = {
    getDetails,
};