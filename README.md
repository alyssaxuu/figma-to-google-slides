# Figma to Google Slides
![Demo](https://media.giphy.com/media/1zKgvNDdxfElnYOL1p/giphy.gif)
<br>
Convert [Figma](https://figma.com) frames into a Google Slides presentation, as showcased [here](https://twitter.com/tcodinat/status/1086934646959558656) 📽️

The order of the slides is determined by the frame hierarchy in Figma, from bottom to top. That means that the first slide is the one placed on the bottom of the "Layers" panel, and the last one is the one on the top.

Made by 18 y/o 👩 [Alyssa](https://tcodina.com)


# Installation

 1. Import the [Google API PHP Library](https://github.com/googleapis/google-api-php-client)! ✨ If you import it without composer, make sure that the path on the first line matches where the library is hosted in your server. Otherwise, you can replace that line from the code.
 2. Create a service API key in the [Google API Console](https://console.cloud.google.com/apis/). You can follow the same steps described in the second section [of my guide on using the Google Sheets API](https://medium.com/hackerpreneur-magazine/how-to-use-google-sheets-as-a-cms-or-a-database-f9d8e736fdce) 📖 . Import it to your server and replace the path in the code.
 3. Go to your Google Slides presentation, click on "Share" and enter the previously generated email address (your service API email address) into the "People" field with edit permissions 🔑
 4. Replace the Google Slides presentation ID and Figma file ID from the code 🔗
 5. Find your personal Figma access token by going to the [API documentation](https://www.figma.com/developers/docs) 🤖, scrolling down to the "Access Tokens" section, and clicking on "Get personal access token" on the right. Replace it in the code.
 6. Run the script & enjoy! Every time you run the script you will update the slides with the different frames from Figma 🍭
#
 Feel free to reach out to me through email at discuss@tcodina.com or [on Twitter](https://twitter.com/alyssaxuu) if you have any questions or feedback! Hope you find this useful 💜
