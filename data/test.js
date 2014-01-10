$(document).ready(function() {

    $("#jquery_jplayer_1").jPlayer({
        ready: function(event) {
            $(this).jPlayer("setMedia", {
                mp3: "http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
                oga: "http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
            });
        },
        swfPath: "flash",
        supplied: "mp3, oga"
    });
});                                      
