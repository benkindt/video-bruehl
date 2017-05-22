var eventBus = AnnotationPlayer.EventBus();
eventBus.on(AnnotationPlayer.Events.PLAYER_READY, onPlayerReady);

var player = AnnotationPlayer.Player({
    target: 'youtubeplayer',
    width: 640,
    height: 360
});

player.registerRegion('region-image', updateRegionImage);
player.registerRegion('region-member', updateRegionMember);
player.registerRegion('region-state', updateRegionState);
player.registerRegion('region-score-1', updateRegionScore1);
player.registerRegion('region-score-2', updateRegionScore2);

player.initialize('presentation.xml');

function onPlayerReady(context) {
    fluidvids.init({
        selector: ['iframe'],
        players: ['www.youtube.com']
    });

    var meta = context.meta;

    $('#presentation-title').text(meta.title);
    $('#presentation-author').text(meta.author);

    var creation = moment(meta.info['Creation Date']).format('dddd MMMM Do, YYYY');
    $('#presentation-creation-time').text(creation);
    $('#presentation-video-id').text(meta.videoId);

    $('#score-team1-name').text(meta.teams[0].name);
    $('#score-team1-img').attr('src', meta.teams[0].image);
    $('#members-team1-name').text(meta.teams[0].name);
    addTeamMembers('#members-team1', meta.teams[0].members);

    $('#score-team2-name').text(meta.teams[1].name);
    $('#score-team2-img').attr('src', meta.teams[1].image);
    $('#members-team2-name').text(meta.teams[1].name);
    addTeamMembers('#members-team2', meta.teams[1].members);

    $('#footer').html(meta.info['Footer']);
}

function addTeamMembers(target, members) {
    $(target).html('');

    for (var i = 0; i < members.length; i++) {
        var member = members[i];
        var name = member.firstName + ' ' + member.lastName;

        if (member.yearOfBirth) {
            name += ' (' + member.yearOfBirth + ')';
        }

        $(target).append(
            $('<li>').attr('class', 'list-group-item').append(name)
        );
    }
}

function updateRegionImage(args) {
    $('#current-image').attr('src', args[0]);
}

function updateRegionMember(args) {
    $('#current-member-image').attr('src', args[0]);
    $('#current-member-name').text(args[1]);
    $('#current-member-team').text(args[2]);
}

function updateRegionScore1(args) {
    $('#current-score-1').text(args[0]);
}

function updateRegionScore2(args) {
    $('#current-score-2').text(args[0]);
}

function updateRegionState(args) {
    $('#current-state').html(args[0]);
}
