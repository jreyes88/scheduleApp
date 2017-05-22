

jQuery(document).ready(function() {

    var gjoinUrl,
        attendeeAccessCode,
        conferenceCallNumbersUrl,
        webinarDescription,
        confCallType,
        attendeeInfo,
        confCallInfo,
        isPrivate,
        preferredTollFreeNumber,
        preferredTollNumber,
        preferredTollFreeCountry,
        preferredTollCountry,
        summary,
        organizerEmail;

    //if you are on the confirmation page, initialise the add this event plugin or
    //if you are on the addtocalendar page redirected from the email, initialise the add this event plugin
    if(window.location.href.indexOf('confirmation.tmpl')!=-1 || window.location.href.indexOf('addToCalendar.tmpl')!=-1) {
        calendarDetails();
        //show the smartbanner for Android / iOS6- devices
        $.smartbanner({title:'GoToWebinar', author: 'Citrix', icon:'/images/daisyAndroid57.png', layer:true});
        //scrollUp to show App Store smart banner. It is hidden by default
        window.scrollTo(0, -100);

        assignJoinCheckAppLinkWithQueryParams();

        function assignJoinCheckAppLinkWithQueryParams(){

            if($('#joinCheckAppLink').length > 0){
                var $joinCheck = $('#joinCheckAppLink');
                var joinCheckLink = $('#joinCheckAppLink').attr('href');
                var lang = $('html').attr('lang')
                    .replace('en_US', 'english')
                    .replace('de_DE', 'german')
                    .replace('es_ES', 'spanish')
                    .replace('it_IT', 'italian')
                    .replace('fr_FR', 'french')
                    .replace('zh_CN', 'chinese');

                if(!lang){
                    lang = 'english';
                }

                joinCheckLink += '?' + ['role=attendee', 'language='+lang, 'source=attendeeRegistrationPage'].join('&');
                $joinCheck.attr('href', joinCheckLink);
            }
        }
    }
    //if you are on the additionalInfo page, populate data on that page
    if(window.location.href.indexOf('additionalInfo.tmpl')!=-1){
        additionalDetails();
    }

    $('.LoadingDiv').hide()
        .ajaxStart(function() {
            $('#tr-time-list').hide();
            $('#recurring-time-select').hide();
            $(this).show();
        })
        .ajaxStop(function() {
            $(this).hide();
            $('#tr-time-list').show();
            $('#recurring-time-select').show();
        });

    //Check if cookie exists
    var aUserTzCookiePref = jQuery.cookie("g2w_attendee_tz_pref");

    if (aUserTzCookiePref) {
        updateTimeZoneFromServer(aUserTzCookiePref);

    } else {
        //auto detect users timezone
        var tz = jstz.determine();
        updateTimeZoneFromServer(tz.name());
    }

    //On selecting a value in Modal, perform operations
    if(jQuery("#timezone-modal-set").length) {
        jQuery("#timezone-modal-set").click(function () {

            var tz = jQuery('#timezone').val();

            updateTimeZoneFromServer(tz);

            $('#timezone-modal').modal('hide')
        });
    }
    if (!jQuery('#isMobileInAppRegistration').length) {
        setRegistrationValueFromCookie();
    }
});

function setRegistrationValueFromCookie() {
    var fieldsList = "givenName,surname,email";
    if(jQuery('#hasEmail').val() == "true") {
        fieldsList = "givenName,surname";
    }
    var fields = fieldsList.split(",");
    for(var i=0; i< fields.length; i++) {
        var id = "registrant." + fields[i];
        var value = fields[i];
        if(id && value) {
            jQuery('[id="'+ id + '"]').val(jQuery.cookie("g2w_attendee_" + value));
        }
    }
}

function updateTimeZoneFromServer(timeZone) {

    jQuery('[name="registrant.timeZone"]').val(timeZone);

    //create a entry in cookie which is valid for 1 year
    jQuery.cookie("g2w_attendee_tz_pref", timeZone, { expires: 365 , path : '/'});
    var data = "tz=" + timeZone;

    if (jQuery('#recurrence-key').length) {
        data += "&recurrenceKey=" + jQuery('#recurrence-key').val();
    }

    if (jQuery('#training-key').length) {
        data += "&webinarKey=" + jQuery('#training-key').val();
    }

    jQuery.ajax({
        url: "/webinar/times.json",
        data: data,
        dataType: "json",
        success: function(json) {
            if (json && json.times) {
                updateTimes(json.times);
            }
        }
    });
}

function updateTimes(times) {
    if (jQuery('#recurringTrainingTimesBox select').length) {
        doUpdateRecurringTimes(times);
    } else {
        doUpdateTimes(times);
    }
}

function doUpdateTimes(times) {
    var timesHtml = '';
    var allPast = true;
    for (var i=0; i<times.length; i++) {
        if (!times[i].past) {
            allPast = false;
            break;
        }
    }
    for (var i=0; i<times.length; i++) {
        if (i==0) {
            clazz = "next";
        } else if (i < 3) {
            clazz = "future";
        } else {
            clazz = "far-future";
        }
        if (!allPast && times[i].past) {
            clazz = "past";
        }
        timesHtml += '<li class="' + clazz + '">' + times[i].time + '</li>';
    }

    jQuery('#training-times').html(timesHtml);
}

function doUpdateRecurringTimes(times) {
    var timesHtml = '';
    var selectedIndex = $('#recurringTrainingTimesBox select :selected').index();
    var isSelected = false;
    var allPast = true;

    for (var i=0; i<times.length; i++) {
        if (!times[i].past) {
            allPast = false;
            break;
        }
    }
    for (var i=0; i<times.length; i++) {
        var full = '';

        if (!allPast && (times[i].full || times[i].past)) {
            full = ' disabled="disabled"';
        }


        // Select the option which was selected by default at page load.
        var selected = '';
        if (i == selectedIndex) {
            selected = ' selected="selected"';
            isSelected = true;
        }
        timesHtml += '<option value="' + times[i].webinarKey + '"' + full + selected + '>' + times[i].time + '</option>';
    }

    jQuery('#recurringTrainingTimesBox select').html(timesHtml);
}

/**
 * Function to initialise the data to be added in the calendars.
 * @author - Sarim Zaidi
 *
 *
 */

function calendarDetails() {
    //make the url for the API call, takes the webinar key and registrant confirmation key from the url of the confirmation page
    var href=window.location.href,
        param=href.split('&'),
        startTime,
        endTime,
        timeZone,
        organizerName,
        cal,
        webinarParam = urlParam("webinar", href),
        regConfParam = urlParam("registrantConfirmation", href),
        url = makeCallUrl(webinarParam,regConfParam);

    //make the rest call asynchronously, so that page is loaded with the data from the server.
    $.ajax({url: url, async:false}).done(function (data) {


        startTime = data.registrationInformation.registrant.training.trainingTimes[0].startDate;
        endTime = data.registrationInformation.registrant.training.trainingTimes[0].endDate;
        timeZone = data.registrationInformation.registrant.training.timeZone;
        summary = data.registrationInformation.registrant.training.name;
        organizerName = data.registrationInformation.trainer.givenName+ ' ' +data.registrationInformation.trainer.surname;
        organizerEmail = data.registrationInformation.trainer.email;
        isPrivate=data.registrationInformation.registrant.training.conferencingSettings.privateConferencingInfo;

        webinarDescription= data.registrationInformation.description;

        //TODO: it doesn't have error handling for object 'data.registrationInformation.confCallInfo', this value is null\undfined for some response
        //set preferred Audio Country
        if (data.registrationInformation.confCallInfo && Object.keys(data.registrationInformation.confCallInfo).length > 0) {

            conferenceCallNumbersUrl = data.registrationInformation.conferenceCallNumbersUrl;
            preferredTollFreeCountry = data.registrationInformation.preferredTollFreeCountry;
            preferredTollCountry = data.registrationInformation.preferredTollCountry;
            preferredTollNumber = null;
            preferredTollFreeNumber =null;

            if (preferredTollFreeCountry != null && data.registrationInformation.confCallInfo[preferredTollFreeCountry].tollFreeNumber != null) {
                preferredTollFreeNumber = data.registrationInformation.confCallInfo[preferredTollFreeCountry].tollFreeNumber;
                attendeeAccessCode = data.registrationInformation.confCallInfo[preferredTollFreeCountry].attendeeAccessCode;
            }

            if (preferredTollCountry != null && data.registrationInformation.confCallInfo[preferredTollCountry].tollNumber != null) {
                preferredTollNumber = data.registrationInformation.confCallInfo[preferredTollCountry].tollNumber;
                attendeeAccessCode = data.registrationInformation.confCallInfo[preferredTollCountry].attendeeAccessCode;
            }
        }

        confCallType=data.registrationInformation.registrant.training.conferencingSettings.confCallType;

        if(isPrivate!=null) {
            attendeeInfo = data.registrationInformation.registrant.training.conferencingSettings.privateConferencingInfo.attendeeInfo;
        }

        if(data.registrationInformation.confCallInfo!=null) {
            confCallInfo = data.registrationInformation.confCallInfo;
        }



        gjoinUrl = data.registrationInformation.joinUrl;

        // for internationalisation
        $.loadMessages(data.registrationInformation.registrant.training.locale.substring(0, 2),callbackfunc);

        var webinarTimezone = $('#webinarTimezone').val();
        var formatedSTime= $.convertEpochTime(startTime,webinarTimezone,'DD-MM-YYYY')+' '+ $.convertEpochTime(startTime,webinarTimezone,'hh:mm:ss a');
        var formatedETime= $.convertEpochTime(endTime,webinarTimezone,'DD-MM-YYYY')+' '+ $.convertEpochTime(endTime,webinarTimezone,'hh:mm:ss a');

        //bind the data from the rest API to the frontend
        $('._start').text(formatedSTime);
        $('._end').text(formatedETime);
        $('._summary').text('GoToWebinar - '+summary);
        $('._location').text('GoToWebinar');
        $('._organizer').text(organizerName);
        $('._organizer_email').text(organizerEmail);

        //call the addthisevent plugin to catch the changes in the DOM
        window.addthisevent.refresh();

        //depending on the cal in the parameter, click appropriate button.(http://localhost:8090/addToCalendar.tmpl?webinar=4768074320200926464&registrantConfirmation=137642728031589632&cal=google)
        if(window.location.href.indexOf('addToCalendar.tmpl')!=-1 ) {
            cal = param[2].substring(param[2].indexOf('=') +1);
            switch(cal){
                case 'google':
                    $('.ategoogle').click();
                    break;

                case 'outlook':
                    $('.ateoutlook').click();
                    break;

                case 'ical':
                    $('.ateical').click();
                    break;

                case 'yahoo':
                    $('.ateyahoo').click();
                    break;

                case 'hotmail':
                    $('.atehotmail').click();
                    break;
            }


        }


    });


}

function getJoinInfo($, g2wBrokerUrl, webinarKey, joinUrl){
    var attendeeId = joinUrl.split('/').pop();
    return $.get(g2wBrokerUrl + '/api/webinars/' + webinarKey+ '/webAttendee/'+attendeeId + '/joinInfo');
}

function makeCallUrl(webinarParam , regConfParam){

    return '/api/webinar/' + webinarParam+ '/registrationinformation.json?registrantKey='+ regConfParam;

}

function urlParam(name, url) {

    if (!url) {
        url = window.location.href;
    }
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) {
        return 0;
    }
    return results[1] || 0;
}

/**
 * Function to initialise the additional data to be added to the new page
 * @author - Sarim Zaidi
 *
 *
 */

function additionalDetails(){
    //make the url for the API call, takes the webinar key and registrant confirmation key from the url of the confirmation page
    var href=window.location.href,
        param=href.split('&'),
        url,
        startTime,
        endTime,
        timeZone,
        organizerName;

    var webinarKey = param[1].substring(param[1].indexOf('=') +1);
    url = '/api/webinar/' + webinarKey + '/registrationinformation.json?registrantKey='+ param[2].substring(param[2].indexOf('=') +1);

    //make the rest call asynchronously, so that page is loaded with the data from the server.
    $.ajax({url: url, async:false}).done(function (data) {

        startTime = data.registrationInformation.registrant.training.trainingTimes[0].startDate;
        endTime = data.registrationInformation.registrant.training.trainingTimes[0].endDate;
        timeZone = data.registrationInformation.registrant.training.timeZone;
        summary = data.registrationInformation.registrant.training.name;
        organizerName = data.registrationInformation.trainer.givenName+ ' ' +data.registrationInformation.trainer.surname;
        organizerEmail = data.registrationInformation.trainer.email;
        isPrivate=data.registrationInformation.registrant.training.conferencingSettings.privateConferencingInfo;

        webinarDescription= data.registrationInformation.description;


        //set preferred Audio Country
        if ( Object.keys(data.registrationInformation.confCallInfo).length > 0) {

            conferenceCallNumbersUrl = data.registrationInformation.conferenceCallNumbersUrl;
            preferredTollFreeCountry = data.registrationInformation.preferredTollFreeCountry;
            preferredTollCountry = data.registrationInformation.preferredTollCountry;
            preferredTollNumber = null;
            preferredTollFreeNumber =null;


            if (preferredTollFreeCountry != null && data.registrationInformation.confCallInfo[preferredTollFreeCountry].tollFreeNumber != null) {
                preferredTollFreeNumber = data.registrationInformation.confCallInfo[preferredTollFreeCountry].tollFreeNumber;
                attendeeAccessCode = data.registrationInformation.confCallInfo[preferredTollFreeCountry].attendeeAccessCode;
            }

            if (preferredTollCountry != null && data.registrationInformation.confCallInfo[preferredTollCountry].tollNumber != null) {
                preferredTollNumber = data.registrationInformation.confCallInfo[preferredTollCountry].tollNumber;
                attendeeAccessCode = data.registrationInformation.confCallInfo[preferredTollCountry].attendeeAccessCode;
            }
        }

        confCallType=data.registrationInformation.registrant.training.conferencingSettings.confCallType;

        if(isPrivate!=null) {
            attendeeInfo = data.registrationInformation.registrant.training.conferencingSettings.privateConferencingInfo.attendeeInfo;
        }

        if(data.registrationInformation.confCallInfo!=null) {
            confCallInfo = data.registrationInformation.confCallInfo;
        }



        gjoinUrl = data.registrationInformation.joinUrl;


            getJoinInfo($, g2wBrokerUrl, webinarKey, gjoinUrl).then(
                function(joinInfo){

                    $.loadMessages(data.registrationInformation.registrant.training.locale.substring(0, 2),function(){
                        //confirmation, and icsfile are gloabl variable generated in the proccess of callback at $.loadMessage
                        additionalCallBack(confirmation, icsfile, registrationinfo, joinInfo.avbroadcastEnabled);
                    });
                },
                function() {
                    window.location.href='/error.tmpl';
                });

        // for internationalisation

    })
    .fail(function() {
        window.location.href='/error.tmpl';
    });

}

/**
 * callback function to add additional details to the new page
 * @author - Sarim Zaidi
 *
 *
 */

function additionalCallBack(confirmation, icsfile, registrationinfo, isAVBroadcastSession) {
    /**there are following types of webinars and each will have their own email template
     *
     * 1.Long Distance Call only
     * 2.VOIP call only
     * 3.Hybrid call, both the above
     * 4.Long Distance with multiple countries
     * 5.Hybrid with multiple countries
     * 6.Private Calling
     */


    var additionalInfo;


    //all emails have this, the join url
    var description =confirmation.join + '<br />' +
        '<a href="'+ gjoinUrl + '">'+gjoinUrl+'</a><br />'+
        confirmation.joinSuffix+'<br />';

    additionalInfo=description;

    //If it is AVBroadcastSession, it should not expose VOIP, PSTN information to attendees
    if(!isAVBroadcastSession){
        //if the webinar supports voip
        var voip='<br />'+confirmation.audio.voip.instructions+'<br />' +
            '<br />'+confirmation.audio.voip.additional.instructions+'<br />';

        //long distance call capability
        if (preferredTollFreeNumber != null || preferredTollNumber != null) {
            var pstn = '<br />' + confirmation.audio.pstn.instructions + '<br />' +
                confirmation.audio.pstn.additional.instructions + '<br /><br />';

            if (preferredTollFreeNumber != null) {
                pstn = pstn + icsfile.tollFree( preferredTollFreeCountry, preferredTollFreeNumber ) + "<br />";
            }

            if (preferredTollNumber != null) {
                pstn = pstn + icsfile.toll( preferredTollCountry, preferredTollNumber ) + "<br />";
            }
            pstn = pstn + confirmation.audio.accessCode( attendeeAccessCode ) + '<br />' +
                confirmation.audio.audioPin + '<br />';
        }

        //separator --OR--
        var separator='<br />' + confirmation.audio.hybrid.separator + '<br />';

        //Hybrid call
        if (preferredTollFreeNumber != null || preferredTollNumber != null) {
            var hybrid = '<br />' + confirmation.audio.hybrid.instructions + '<br /><br />' +
                confirmation.audio.hybrid.voip.instructions + '<br />' +
                confirmation.audio.voip.additional.instructions + '<br />' +
                separator + '<br />' +
                confirmation.audio.hybrid.pstn.instructions + '<br />' +
                confirmation.audio.pstn.additional.instructions + '<br /><br />';

            if (preferredTollFreeNumber != null) {
                hybrid = hybrid + icsfile.tollFree( preferredTollFreeCountry, preferredTollFreeNumber ) + "<br />";
            }

            if (preferredTollNumber != null) {
                hybrid = hybrid + icsfile.toll( preferredTollCountry, preferredTollNumber ) + "<br />";
            }

            hybrid = hybrid + confirmation.audio.accessCode( attendeeAccessCode ) + '<br />' +
                confirmation.audio.audioPin + '<br />';
        }

        //Private call
        if(isPrivate!=null) {
            var privateCall = '<br />' + confirmation.audio.private.instructions + '<br />' +
                attendeeInfo;
        }


        //if multiple countries selected
        if (confCallInfo != null && Object.keys(confCallInfo).length > 0) {
            var moreCountries = '<br />' + icsfile.moreCountries + '<br />' +
                icsfile.moreCountriesAdditional + '<br />' +
                '<a href="' + conferenceCallNumbersUrl + '">' + conferenceCallNumbersUrl + '</a>';
        }



        //  create description based on the conference type
        switch(confCallType) {
            case 'PRIVATE':
                additionalInfo += privateCall;
                break;
            case 'VOIP':
                additionalInfo += voip;
                break;
            case 'HYBRID':
                if(Object.keys(confCallInfo).length===1){
                    additionalInfo += hybrid;
                }
                else{
                    additionalInfo += hybrid + moreCountries;
                }
                break;
            case 'PSTN':
                if(Object.keys(confCallInfo).length===1){
                    additionalInfo += pstn;
                }
                else{
                    additionalInfo += pstn+moreCountries;
                }
                break;
        }
    }

    var href=window.location.href,
        param=href.split('&'),
        url = '/registration/cancel.tmpl?webinar=' + param[1].substring(param[1].indexOf('=') +1) + '&registrant='+ param[2].substring(param[2].indexOf('=') +1);


    $('#trainingName').html(summary);
    $('#contactEmail').html(organizerEmail);
    $('#contactEmail').attr('href','mailto:'+organizerEmail);
    $('#approveCancel').attr('href',url);

    //complete info string that needs to be displayed on the additionalInfo page
    //the description of the webinar added in the end
    var organizersDescription="";

    if(webinarDescription!=null) {
        organizersDescription = '<br /><br />' + webinarDescription + '<br />';
    }
    additionalInfo+=organizersDescription;
    $('.AdditionalInformation').html(additionalInfo);

}
/**
 * add description to the plugin--the email body
 * @author - Sarim Zaidi
 *
 *
 */
function callbackfunc() {


    //all emails have this, the join url
    var description =confirmation.join + '<br />' +
        '<a href="'+ gjoinUrl + '">'+gjoinUrl+'</a><br />'+
        confirmation.joinSuffix+'<br />';

    if(window.location.href.indexOf('confirmation.tmpl')!=-1 ) {
        var hrefAdditional = window.location.href,
            paramAdditional = hrefAdditional.split('?'),
            domain = paramAdditional[0].split('registration'),
            urlAdditional = domain[0] + 'additionalInfo.tmpl?' + paramAdditional[1].replace('&r', '&ar');

        var additionalInfoLink = '<br />2. <a href="' + urlAdditional + '">' + registrationinfo.more.webinar + '<br />' + urlAdditional + '</a>';
    }

    //if we reach here from email, then the url would be different and we have to create the additionalInfoLink in a different manner.
    if(window.location.href.indexOf('addToCalendar.tmpl')!=-1 ) {
        var hrefAdditional = window.location.href,
            paramAdditional = hrefAdditional.split('?'),
            domain = paramAdditional[0].split('addToCalendar'),
            removeCalParam = paramAdditional[1].split('&'),
            aParam = removeCalParam[0]+ '&'+ removeCalParam[1];
        urlAdditional = domain[0] + 'additionalInfo.tmpl?' + 'duplicate=false&' + aParam.replace('&r', '&ar');

        var additionalInfoLink = '<br />2. <a href="' + urlAdditional + '">' + registrationinfo.more.webinar + '<br />' + urlAdditional + '</a>';
    }


    //to be added to the calendars description
    description+=additionalInfoLink;
    $('._description').html(description);


}
