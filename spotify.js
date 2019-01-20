$(document).ready(()=>{
    window.onSpotifyWebPlaybackSDKReady=()=>{
        $.getJSON("config.json",function(data){
            const token = data.spotify;
            const player = new Spotify.Player({
            name: 'Aesthetic Views',
            getOAuthToken: cb => { cb(token); }
            });

            // Error handling
            player.addListener('initialization_error', ({ message }) => { alert(message); });
            player.addListener('authentication_error', ({ message }) => { alert(message); });
            player.addListener('account_error', ({ message }) => { alert(message); });
            player.addListener('playback_error', ({ message }) => { alert(message); });

            // Playback status updates
            player.addListener('player_state_changed', state => { console.log(state); });

            // Ready
            player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            });
            setInterval(getstate,1000)
            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            });
            function getstate(){
                player.getCurrentState().then(state=>{
                    if(state){
                        $('#spotify-info').css('visibility','visible');
                        let total_time = state.duration/1000;
                        let current_song_time   = state.position/1000;
                        let total_minutes = Math.floor(total_time / 60); 
                        let total_seconds = Math.floor(total_time - (total_minutes * 60));
                        if(total_seconds<10){
                            total_seconds = "0"+total_seconds;
                        }
                        let current_minutes = Math.floor(current_song_time/60);
                        let current_seconds = Math.floor(current_song_time - (current_minutes*60));
                        if(current_seconds < 10){
                            current_seconds = "0"+current_seconds;
                        }
                        if(state.paused){
                            $('#spotify-playpause').removeClass("fa-pause").addClass("fa-play");

                        }else{
                            $('#spotify-playpause').removeClass("fa-play").addClass("fa-pause");
                        }
                        $('#song-time').text(current_minutes.toString()+ ':'+current_seconds.toString() + '/' + total_minutes.toString()+":"+total_seconds.toString());
                        let current_track = state.track_window.current_track;
                        let artists = current_track.artists.map(e=>e.name).join(',');
                        $('#song-name').text(artists + " - " + current_track.name);
                    }else{
                        $('#spotify-info').css('visibility','hidden');
                    }
                });
            }
            $("#spotify-prev").click(function(){
                player.previousTrack();
            });
            $("#spotify-playpause").click(function(){
                player.togglePlay();
                player.getCurrentState().then(state=>{
                    if(state.paused){
                        $('#spotify-playpause').removeClass("fa-play").addClass("fa-pause");
                    }else{
                        $('#spotify-playpause').removeClass("fa-pause").addClass("fa-play");
                    }
                });
            });
            $("#spotify-next").click(function(){
                player.nextTrack();
            });
            // Connect to the player!
            player.connect();
        });
    };
});
