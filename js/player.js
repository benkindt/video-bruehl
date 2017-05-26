var player;
var json;

// my player init
$(document).ready(function() {
    player = videojs('my-player', {
        techOrder: ['flash', 'html5'],
        autoplay: true,
        loop: true,
        controlBar: false,
        width: 768,
        height: 432,
        sources: [{ 
            type: "video/mp4",
            src: "http://www.steveconrad.de/interactive_media/SCF_0004.mp4"
        }]
    });
    
    player.overlay({
        content: '<div class="videoOverlay">&nbsp;&nbsp;Tante-Emma-Laden&nbsp;&nbsp;</div>',
        debug: true,
        showBackground: false,
        overlays: [{
          content: '<div class="videoOverlay">&nbsp;<a class="videoLink" onClick="showPoiDetails();">The video is playing!</a>&nbsp;</div>',
          start: 'play',
          end: 'pause'
        }, {
          start: 0,
          end: 15,
          align: 'bottom-left'
        }, {
          start: 15,
          end: 30,
          align: 'bottom'
        }, {
          start: 30,
          end: 45,
          align: 'bottom-right'
        }, {
          start: 20,
          end: 'pause'
        }]
      });
    
    function getXmlPresentation(){
    	console.log("getting xml-presentation...");
    	// XML to JSON with jquery and xml2json (https://github.com/sparkbuzz/jQuery-xml2json)    
        $.ajax({
            url: '../data/xml/interactive_media.xml',
            dataType: 'xml',
            success: function(response) {
                json = $.xml2json(response);
                console.log(json);
            },
            error: function (request, status, error) {
                console.log(request);
            }
        });
    }
    
    getXmlPresentation();
    
    // bind interactive components
    $('#getPresentation').on('click', function() {
        getXmlPresentation();
    });
    
    $('#change1').on('click', function() {
        changeSource({ 
            type: "video/webm",
            src: "http://upload.wikimedia.org/wikipedia/mediawiki/d/d1/Wikipedia_on_Google_Glass_screencast_test.webm"
        });
    });

    $('#change2').on('click', function() {
    	changeSource({ 
            type: "video/mp4",
            src: "../data/vid/SCF_0001.mp4"
        });
    });
    
    $('#getTime').on('click', function() {
        console.log("current Time is: " + getTime());
    });
    
    $('#showMetadata').on('click', function() {
    	changeVideo($('#idInput').val());
    });
    
});

function changeVideo(id){
	console.log(json['#document']['interactive_media']['videos']);
	console.log(id);
//	var videoObject = json['#document']['interactive_media']['videos']['video'][id];
	var videoObject = getVideoObject(id);
	console.log(videoObject);
	directionOutput(videoObject);
	listMetadata(videoObject);
//	listPointsOfInterest(videoObject);
	var sourceFile = "../data/vid/" + videoObject['filename'];
	console.log(sourceFile);
	changeSource({ 
        type: "video/mp4",
        src: sourceFile
    });
	showPois(videoObject);
}

function getVideoObject(id){
	for(var i = 0; i < json['#document']['interactive_media']['videos']['video'].length; i++) {
		console.log("found next video object");
		var obj = json['#document']['interactive_media']['videos']['video'][i];
		if(obj.$.id == id){
			return obj;
		}
	}
}

function directionOutput(obj){
	console.log("showing direction for " + obj);
	var string = "";
	$("#left").css("visibility", "hidden");
	$("#left").css("cursor", "auto");
	$("#right").css("visibility", "hidden");
	$("#right").css("cursor", "auto");
	$("#turnaround").css("visibility", "hidden");
	$("#turnaround").css("cursor", "auto");
	$("#front").css("visibility", "hidden");
	$("#front").css("cursor", "auto");
	$("#frontleft").css("visibility", "hidden");
	$("#frontleft").css("cursor", "auto");
	// loop over the neighbours
	for(var i = 0; i < obj["neighbours"]["neighbour"].length; i++) {
	    var neigh = obj["neighbours"]["neighbour"][i];
	    console.log(neigh);
	    var direction = neigh.n_type;
	    var directionLabel = "";
	    if(direction == "turnleft"){
	    	directionLabel = "Nach links";
	    	$("#left").css("visibility", "visible");
	    	$("#left").css("cursor", "pointer");
	    	$("#left").attr("onclick", "changeVideo(" + neigh.n_id + ")");
	    } else if (direction == "turnright") {
	    	directionLabel = "Nach rechts";
	    	$("#right").css("visibility", "visible");
	    	$("#right").css("cursor", "pointer");
	    	$("#right").attr("onclick", "changeVideo(" + neigh.n_id + ")");
	    } else if (direction == "turnaround") {
	    	directionLabel = "Nach hinten";
	    	$("#turnaround").css("visibility", "visible");
	    	$("#turnaround").css("cursor", "pointer");
	    	$("#turnaround").attr("onclick", "changeVideo(" + neigh.n_id + ")");
	    } else if (direction == "forward") {
	    	directionLabel = "Nach vorn";
	    	$("#front").css("visibility", "visible");
	    	$("#front").css("cursor", "pointer");
	    	$("#front").attr("onclick", "changeVideo(" + neigh.n_id + ")");
	    } else if (direction == "frontleft") {
	    	directionLabel = "Nach links vorn"
	    	$("#frontleft").css("visibility", "visible");
	    	$("#frontleft").css("cursor", "pointer");
	    	$("#frontleft").attr("onclick", "changeVideo(" + neigh.n_id + ")");
	    }
//	    string += "<span class='videoLink' onclick='changeVideo(" + neigh.n_id + ")'>" + directionLabel + "</span></br>"
	}
//	$("#directions").html(string);
}

function listMetadata(obj) {
	$("#locationName").text(obj['street']);
	$("#locationCoordinates").text(obj['coordinates']);
	$("#locationDirection").text(obj['direction_of_view']);
}

function showPois(obj) {
	console.log("show pois");
	console.log(obj);
	// loop over the poi's
	for(var i = 0; i < obj["POIs"]["POI"].length; i++) {
	    var poi = obj["POIs"]["POI"][i];
	    console.log(poi);
	}
}
	
function changeSource(src) {
    player.pause();
    player.currentTime(0);

    player.src(src);

    player.ready(function() {
        this.one('loadeddata', videojs.bind(this, function() {
            this.currentTime(0);
        }));

        this.load();
        this.play();
    });
}

function getTime(){
	return player.currentTime();
}
