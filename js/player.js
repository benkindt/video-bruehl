var player;
var json;

// my player init
$(document).ready(function() {
    player = videojs('my-player', {
        techOrder: ['flash', 'html5'],
        autoplay: true,
        sources: [{ 
            type: "video/mp4",
            src: "http://vjs.zencdn.net/v/oceans.mp4"
        }, {
        	type: "video/webm",
        	src: "http://vjs.zencdn.net/v/oceans.webm"
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
        
    });
    
    $('#getTime').on('click', function() {
        console.log("current Time is: " + getTime());
    });
    
    $('#showMetadata').on('click', function() {
    	var videoObject = json['#document']['interactive_media']['videos']['video'][$('#idInput').val()];
//    	listMetadata(videoObject);
    	changeVideo();
    });
    
});

function changeVideo(){
	var videoObject = json['#document']['interactive_media']['videos']['video']['2'];
	listMetadata(videoObject);
	listPointsOfInterest(videoObject);
	changeSource({ 
        type: "video/mp4",
        src: "../data/vid/" + videoObject['filename']
    });
	showAnnotations(videoObject);
}

function listMetadata(obj) {
	$("#locationName").text(obj['street']);
	$("#locationCoordinates").text(obj['coordinates']);
	$("#locationDirection").text(obj['direction_of_view']);
}

function showAnnotations(obj) {
	console.log(obj);
	// loop over the neighbours
	for(var i = 0; i < obj["neighbours"]["neighbour"].length; i++) {
	    var poi = obj["neighbours"]["neighbour"][i];
	    console.log(poi);
	}
	// loop over the poi's
	for(var i = 0; i < obj["neighbours"]["neighbour"].length; i++) {
	    var poi = obj["neighbours"]["neighbour"][i];
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
