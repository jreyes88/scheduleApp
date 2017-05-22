/**
 * Created by sarim on 6/1/16.
 */
jQuery(document).ready(function() {
    //if you are on the recordings page
    if(window.location.href.indexOf('recording')!=-1 || window.location.href.indexOf('/registration.tmpl')!=-1){
        var webinarid = $('#webinarId').val();
        var registrantKey = $('#registrantKey').val();
        var baseUrl = $('#baseUrl').val();
        var jwplayerFlag = $('#jwplayerFlag').val();

        var recordingId = $('#recordingId').val();
        var url;

        if(webinarid && registrantKey && jwplayerFlag){
            // if browser not supported show banner and not call the api.
            if (bowser.firefox && bowser.version < 45 || bowser.msie && bowser.version < 10){
                $('.alert-banner').removeClass('hide');
                $('.video-container').hide();
                return;
            }

            // make a api call to get resource url
            $.ajax({
                url: baseUrl+'/api/V2/webinars/'+webinarid+'/registrants/'+registrantKey+'/recordings/'+recordingId
            }).done(function(res){
                //get Resource url here
                url = res.downloadUrl;
                if(res.type === 'ONLINE'){

                    // replace the player on the page with jwplayer
                    var playerhtml = '<center><div class="video-container"><div id="jwPlayer"></div></div></center>';
                    $('.pad-container').html(playerhtml);
                    //load the jwplayer with s3 url
                    loadFileJwPlayer(url);
                }
            }).fail(function(){
                window.location.href = '/error/content.tmpl';
            });
        }
    }
});

//load the jwPlayer with the s3 url of the recording needed
function loadFileJwPlayer (myFile){
    //initializing jwPlayer
    var playerInstance;
    playerInstance = jwplayer("jwPlayer");
    playerInstance.setup({
        file: myFile,
        autostart : true,
        primary : "html5"
    });
}