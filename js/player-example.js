var player;

function initializeXml(url) {
    // Download the presentation xml
    request({url: url}, function(err, res, body) {
        if (err) {
            console.log('[ERROR]: Could not download presentation');
            return;
        }
        onPresentationXmlReady(body);
    });
}


function onPresentationXmlReady(xmlBody) {
    // Convert XML to JavaScript object
    var presentation = convert.xml2json(xmlBody, {compact: true});
    console.log(presentation);

    meta = getMetaInformation(presentation);
    annotations = getAnnotations(presentation);
    addAnnotationsToRegions(annotations);
}


function getMetaInformation(presentation) {
    var meta = {
        title: presentation.player.meta.title._text,
        author: presentation.player.meta.author._text,
        videoId: presentation.player.meta.youTubeVideoID._text,
        creationDate: presentation.player.meta.creationDate._text,
        videoSource: presentation.player.meta.videoSource._text,
        teams: [],
        info: {}
    };

    // Teams
    var teams = presentation.player.meta.teams.team;
    for (var i = 0; i < teams.length; i++) {
        var team = teams[i];

        var members = [];
        for (var j = 0; j < team.teamMembers.length; j++) {
            var member = team.teamMembers[j];
            members.push({
                firstName: member._attributes.firstname,
                lastName: member._attributes.lastname,
                yearOfBirth: member._attributes.yearOfBirth
            });
        }

        meta.teams.push({
            name: team._attributes.name,
            image: team._attributes.image,
            members: members
        });
    }

    // Additional information
    var infoXml = presentation.player.meta.other.info;
    for (var i = 0; i < infoXml.length; i++) {
        meta.info[infoXml[i]._attributes['name']] = infoXml[i]._attributes['value'];
    }

    return meta;
}


function getAnnotations(presentation) {
    var annotations = [];

    for (var i = 0; i < presentation.player.annotations.annotation.length; i++) {
        var annotation = presentation.player.annotations.annotation[i];

        // Read the arguments
        var args = [];
        if (Array.isArray(annotation.data)) {
            for (var j = 0; j < annotation.data.length; j++) {
                args.push(annotation.data[j]._text);
            }
        } else { // Single value
            args.push(annotation.data._text);
        }

        annotations.push(Annotation({
            region: annotation._attributes.region,
            start: Number(annotation._attributes.start),
            end: Number(annotation._attributes.end),
            args: args
        }));
    }

    return annotations;
}

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

    // XML to JSON with jquery and xml2json (https://github.com/sparkbuzz/jQuery-xml2json)    
    $.ajax({
        url: '../data/xml/interactive_media.xml',
        dataType: 'xml',
        success: function(response) {
            json = $.xml2json(response);
            console.log(json);
            console.log(json['#document']['interactivemedia']['videos']['video']['2']['coordinates']);
        }
    });
    
//    xml2json("../data/xml/interactive_media.xml");

    $('#change1').on('click', function() {
        changeSource({ 
            type: "video/webm",
            src: "http://upload.wikimedia.org/wikipedia/mediawiki/d/d1/Wikipedia_on_Google_Glass_screencast_test.webm"
        });
    });

    $('#change2').on('click', function() {
        changeSource({ 
            type: "video/mp4",
            src: "http://vjs.zencdn.net/v/oceans.mp4"
        });
    });
    
    $('#getTime').on('click', function() {
        console.log("current Time is: " + getTime());
    });
});

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
