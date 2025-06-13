const express = require('express');
const cors = require('cors');
const axios = require('axios');
const router = express.Router();

// API Keys configuration
const API_KEYS = [
  "r8_HhlS8p6MvFNyl2FkcpqbxksqimqbzJC0L7V5D",
  "AmRpyRLxVrWWDbuU_wvcTFbhee1YQQ",
  "53c4e732d41e2ea6b7dab3136f88d2a66e2ded6e782f7368"
];

let currentKeyIndex = 0;

// Middleware to handle CORS
router.use(cors());

// Function to get next API key
const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

// Endpoint to generate image
router.post('/generate', async (req, res) => {
  const { prompt, negativePrompt, width, height, steps, guidance, style } = req.body;
  
  let attempts = 0;
  const maxAttempts = API_KEYS.length;

  while (attempts < maxAttempts) {
    try {
      const currentKey = API_KEYS[currentKeyIndex];
      
      const response = await axios.post(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          text_prompts: [
            {
              text: style !== 'none' ? `${prompt}, ${style} style` : prompt,
              weight: 1
            },
            {
              text: negativePrompt || '',
              weight: -1
            }
          ],
          cfg_scale: guidance,
          height: height,
          width: width,
          steps: steps,
          samples: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentKey}`
          }
        }
      );

      // If successful, send back the image data
      return res.json({
        success: true,
        imageData: response.data.artifacts[0].base64,
        message: 'Image generated successfully'
      });

    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed with key ${currentKeyIndex}:`, error.message);
      
      // Try next API key
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      attempts++;

      // If all keys have been tried, send error response
      if (attempts === maxAttempts) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate image after trying all API keys',
          error: error.message
        });
      }
    }
  }
});

module.exports = router; 