<?php
// Import the Google PHP API library, once uploaded to your server - you can do this part using composer
require_once 'google/vendor/autoload.php';

$client = new \Google_Client();
// The name of the application has no relation to your API project name
$client->setApplicationName('Figma');
$client->setScopes(Google_Service_Slides::PRESENTATIONS);
$client->setRedirectUri('urn:ietf:wg:oauth:2.0:oob');
$client->setAccessType('offline');
// Path to the service key JSON file generated in the Google API Console
$client->setAuthConfig(__DIR__ . '/SERVICE_KEY.json');
$service = new Google_Service_Slides($client);
// The ID of the Google Slides presentation (found in the URL)
$presentationId = 'YOUR_PRESENTATION_ID';
$presentation = $service->presentations->get($presentationId);
$requests = array();
// Your personal access token (found in the Figma API documentation)
$figma_personal_access_token = "YOUR_ACCESS_TOKEN";
// The ID of the Figma file (found in the URL)
$figma_file = "YOUR_FIGMA_FILE_ID";
$figma_file_type = ".png";

$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"X-Figma-Token: " . $figma_personal_access_token
  )
);
$context = stream_context_create($opts);
// Make a call to the Figma file to return all the Node IDs of the different frames
$result = file_get_contents( "https://api.figma.com/v1/files/" . $figma_file, false, $context);
$json = json_decode($result, true);
$nodes = $json["document"]["children"][0]["children"];
// The objectId of the different slides, must be at least 5 characters and unique
$i = 303030;
$presentation = $service->presentations->get($presentationId);
$slides = $presentation->getSlides();
// Delete existing slides from the presentation
foreach($slides as $slide) {
    $requests[] = new Google_Service_Slides_Request(array(
        'deleteObject' => array (
          'objectId' => $slide->objectId
        )
    )); 
}
// Export each frame from Figma, create a new blank slide, and set its background image to the corresponding frame 
foreach($nodes as $node) {
    $i++;
    $thenode = $node["id"];
    $result = file_get_contents( "https://api.figma.com/v1/images/" .$figma_file . "?ids=" . $thenode, false, $context);
    $json = json_decode($result, true);
    $imageUrl = $json["images"][$thenode];
    $theimage = file_get_contents($imageUrl);
    $requests[] = new Google_Service_Slides_Request(array(
        'createSlide' => array (
          'objectId' => (string)$i,
          'slideLayoutReference' => array (
              'predefinedLayout' => "BLANK"
            )
      )
    ));    
    $wip = $imageUrl;
    $requests[] = new Google_Service_Slides_Request(array(
          'updatePageProperties' => array (
        'objectId' => (string)$i,
        'pageProperties' => array(
          'pageBackgroundFill' => array(
            'stretchedPictureFill' => array(
            'contentUrl' => $wip
          )
          )
        ),
        'fields' => 'pageBackgroundFill'
      ) 
    ));
}
// Make all the requests at once to count as a single API call
    $batchUpdateRequest = new Google_Service_Slides_BatchUpdatePresentationRequest([
        'requests' => $requests
    ]);
    $service->presentations->batchUpdate($presentationId, $batchUpdateRequest);
?>