const https = require('https');
const { Client } = require('@threadsjs/threads.js');

// Define the API endpoint URL
const apiUrl = 'https://api.omg.lol/address/[addresshere]/statuses/latest';

// Clear the console and display a header message
console.clear();
console.log('Status.lol - Threads Integration by Ediz Baha');

// Initialize variables to store previous emoji and content
let previousEmoji = '';
let previousContent = '';

// Define an asynchronous function to check the API and share updates
const checkAndShare = async () => {
    try {
        // Make an HTTP GET request to the specified API endpoint
        const response = await new Promise((resolve, reject) => {
            https.get(apiUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }).on('error', (error) => {
                reject(error.message);
            });
        });

        // Parse the JSON response from the API
        const responseData = JSON.parse(response);
        const emoji = responseData.response.status.emoji;
        const content = responseData.response.status.content;

        // Check if the emoji or content has changed since the last check
        if (emoji !== previousEmoji || content !== previousContent) {

            // Create a Threads.js client and login with credentials
            const client = new Client();
            await client.login('[usernamehere]', '[passwordhere]');
            
            // Create a new post with the updated emoji and content
            await client.posts.create(1, { contents: `${emoji} ${content}` });
            console.log(`'${emoji} ${content}' shared on Threads.`);

            // Update the previousEmoji and previousContent variables
            previousEmoji = emoji;
            previousContent = content;
        } else {
            console.log(`'${emoji} ${content}' was already shared on Threads.`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Initial call to checkAndShare function and set up periodic checks
checkAndShare();
setInterval(checkAndShare, 60000);  // Repeat the checkAndShare function every 60 seconds
