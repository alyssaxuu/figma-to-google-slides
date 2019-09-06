var mykey = "";
var apikey = "google_api_key";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "getUrls") {
		getUrls(request, sender, sendResponse);
		return true;
	}
	if (request.type == "startup") {
		getState(request, sender, sendResponse);
		return true;
	}
	if (request.type == "figmakey") {
		figmaKey(request, sender, sendResponse, request.key);
		return true;
	}
	if (request.type == "figmastartup") {
		getFigmaState(request, sender, sendResponse);
		return true;
	}
	if (request.type == "googleapi") {
		googleAPI(request, sender, sendResponse, request.file, request.figma);
		return true;
	}
 });
function getState(request, sender, sendResponse){
		var resp = sendResponse;
	chrome.storage.sync.get('token', function (obj) {  
		if (typeof obj.token === 'undefined' || obj.token == '' || obj.token == 'undefined') {
    		resp({state:"logged out"});
		} else {
			mykey = obj.token;
			resp({state:"logged in",token:obj.token});
		}
	});
}
function getFigmaState(request, sender, sendResponse){
		var resp = sendResponse;
	chrome.storage.sync.get('figmatoken', function (obj) {  
		if (typeof obj.figmatoken === 'undefined' || obj.figmatoken == '' || obj.figmatoken == 'undefined') {
    		resp({state:"logged out"});
		} else {
			resp({state:"logged in",token:obj.figmatoken});
		}
	});
}
function getUrls(request, sender, sendResponse){
		var resp = sendResponse;
			chrome.identity.getAuthToken({interactive: true}, function(token) {
			chrome.storage.sync.set({'token': token}, function() {
				mykey = token;
    			resp({token:token});
  			});
    		});
}
function figmaKey(request, sender, sendResponse, key) {
	var resp = sendResponse;
	chrome.storage.sync.set({'figmatoken': key}, function() {
    	resp({figmatoken:key});
  	});
}
function googleAPI(request, sender, sendResponse, file, figmafile) {
	var resp = sendResponse;
	chrome.storage.sync.get('figmatoken', function (obj) {  
	let init3 = {
		method: 'GET',
		headers: {
			'X-Figma-Token': obj.figmatoken
		}
	};
	fetch('https://api.figma.com/v1/files/'+figmafile,init3).then((response) => response.json()).then(function(data) {
		if (data && data["document"]) {
		var figmadata = data["document"]["children"][0]["children"];
		var nodes = [];
		var images = [];
		figmadata.forEach(function(node) {
			if (node["type"] == "FRAME") {
				nodes.push(node["id"]);
			}
		});
		nodes.reverse();
		var temparray;
		var j = nodes.length;
		var num = 0;
		if (nodes.length != 0) {
			function nextIt() {
				if (num < j) {
					temparray = nodes.slice(num,num+10);
					num+=10;
					const figmarender = async () => {
					await fetch('https://api.figma.com/v1/images/'+figmafile+'/?ids='+temparray.toString()+'&format=jpg&scale=3',init3).then((response) => response.json()).then(function(data) {
					var imageswip = data["images"];
					for (var i = 0; i<temparray.length; i++) {
						images.push(imageswip[temparray[i]]);
						if (i==temparray.length-1) {
							nextIt();
						}
					}
					});
					};
					figmarender();
				} else {
					function runIf() {
						if (images.length == nodes.length) {
							checkFlag();
						} else {
							runIf();
						}
					}
					runIf();
				}
			}
			nextIt();
			function checkFlag(){
			chrome.identity.getAuthToken({interactive: true}, function(token) {
			chrome.storage.sync.set({'token': token}, function() {

			let init = {
				  method: 'GET',
				  async: true,
				  'token': token,
				  headers: {
					'Authorization': 'Bearer '+token,
					Host: 'www.googleapis.com/',
					'Content-Type': 'application/json'
				  },
				  'mode': 'cors',
				  'contentType': 'json'
			};
			fetch('https://slides.googleapis.com/v1/presentations/'+file+'/?key='+apikey+'&access_token='+token, init).then((response) => response.json()).then(function(data) {
				  var slidesjson = data["slides"];
				  var objectId = 303030;
				  var slides = [];
				  var newslides = [];
				  var updateslides = [];
				  if (slidesjson) {
					  slidesjson.forEach(function(slide) {
						  slides.push({'deleteObject': {'objectId': slide["objectId"]}});
					  });
				  }
				  for (var i = 0; i<images.length; i++) {
					  newslides.push({'createSlide' : {'objectId': objectId.toString(), 'slideLayoutReference': {'predefinedLayout': 'BLANK'}}});
					  updateslides.push({'updatePageProperties': {'objectId': objectId.toString(), 'pageProperties': {'pageBackgroundFill': {'stretchedPictureFill': {'contentUrl': images[i]}}},'fields': 'pageBackgroundFill'}});
					  objectId++;
				  }
				slides.push(newslides);
				slides.push(updateslides);
				  let init = {
					  method: 'POST',
					  async: true,
					  'token': token,
					  headers: {
						'Authorization': 'Bearer '+token,
						Host: 'www.googleapis.com/',
						'Content-Type': 'application/json'
					  },
					  body: JSON.stringify({
						  "requests": slides
					  }),
					  'mode': 'cors',
					  'contentType': 'json'
				};
				fetch(
				'https://slides.googleapis.com/v1/presentations/'+file+':batchUpdate/?key='+apikey+'&access_token='+token,
				init).then((response) => response.json()).then(function(data) {
					if (data.replies) {
						resp({type:"success"});
					} else {
						resp({type:"error"});
					}
				});
				});
			});
			});
			
				}
		} else {
			resp({type:"no frames"});
		}
		} else {
			resp({type:"figma error"});
		}
				});
	});
}
