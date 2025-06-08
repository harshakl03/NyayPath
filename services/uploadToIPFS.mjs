import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import ENV from "../config/env.js";

// Replace this with your actual JWT token
const JWT = `Bearer ${ENV.PINATA_JWT_TOKEN}`;

async function uploadToIPFS() {
  const formData = new FormData();
  const filePath = path.join("./services/verdict.json"); // Adjust path as needed
  formData.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity", // for large files
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );

    const cid = response.data.IpfsHash;
    console.log("✅ Uploaded to IPFS via Pinata");
    console.log("CID:", cid);
    console.log(`Gateway URL: https://gateway.pinata.cloud/ipfs/${cid}`);
  } catch (error) {
    console.error(
      "❌ Pinata upload error:",
      error.response?.data || error.message
    );
  }
}

uploadToIPFS();
