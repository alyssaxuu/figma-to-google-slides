# Figma to Google Slides
![Demo](https://media.giphy.com/media/ZcRFEQw8RjOkDu8QiA/giphy.gif)
<br>
Convert [Figma](https://figma.com) frames into a Google Slides presentation, as showcased [here](https://twitter.com/alyssaxuu/status/1086934646959558656) 📽️

The order of the slides is determined by the frame hierarchy in Figma, from top to bottom in the Chrome Extension, but reversed in the Minified Version.

Made by [Alyssa X](https://alyssax.com)


# Installation (for the Minified Version)

 1. Import the [Google API PHP Library](https://github.com/googleapis/google-api-php-client)! ✨ If you import it without composer, make sure that the path on the first line matches where the library is hosted in your server. Otherwise, you can replace that line from the code.
 2. Create a service API key in the [Google API Console](https://console.cloud.google.com/apis/). You can follow the same steps described in the second section [of my guide on using the Google Sheets API](https://medium.com/hackerpreneur-magazine/how-to-use-google-sheets-as-a-cms-or-a-database-f9d8e736fdce) 📖 . Import it to your server and replace the path in the code.
 3. Go to your Google Slides presentation, click on "Share" and enter the previously generated email address (your service API email address) into the "People" field with edit permissions 🔑
 4. Replace the Google Slides presentation ID and Figma file ID from the code 🔗
 5. Find your personal Figma access token by going to the [API documentation](https://www.figma.com/developers/docs) 🤖, scrolling down to the "Access Tokens" section, and clicking on "Get personal access token" on the right. Replace it in the code.
 6. Run the script & enjoy! Every time you run the script you will update the slides with the different frames from Figma 🍭

# Installation (for the Chrome Extension)

1. Create a Chrome extension with the files in the Chrome Extension folder (you can follow [this guide](https://support.google.com/chrome/a/answer/2714278?hl=en)) 📖
2. Generate a OAuth 2.0 client ID in the [Google API Console](https://console.cloud.google.com/apis/). Select "Chrome App", and insert your App ID (which is generated when you create the extension).
3. In the manifest.json, replace "google_client_id" with your previously generated OAuth 2.0 client ID.
4. Generate an API key, leave it as unrestricted, and replace "google_api_key" in the background.js with the generated API key 🔑
5. Install the extension in your browser and enjoy! 
#
 Feel free to reach out to me through email at hi@alyssax.com or [on Twitter](https://twitter.com/alyssaxuu) if you have any questions or feedback! Hope you find this useful 💜
