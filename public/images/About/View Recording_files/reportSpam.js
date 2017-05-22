/**
 * Created by Gaurav on 21/10/15.
 */
var browser = {
        isIe: function () {
            return navigator.appVersion.indexOf("MSIE") != -1;
        },
        navigator: navigator.appVersion,
        getVersion: function() {
            var version = 999; // we assume a sane browser
            if (navigator.appVersion.indexOf("MSIE") != -1)
                // bah, IE again, lets downgrade version number
                version = parseFloat(navigator.appVersion.split("MSIE")[1]);
            return version;
        }
    };

(function( $ ) {
    $.reportSpam = function( method ) {

        $.reportSpam.defaults = {};
        var opts, methods;

        methods = {

            init : function( options ) {

                opts = $.extend( {}, $.reportSpam.defaults, options );

                helpers.showReportSpam();
            }

        };

        var helpers = {

            showReportSpam: function() {
                $("#reportSpamSubmit").click(function() {
                    $("#reportSpamSubmit").unbind('click');
                    $("#reportSpamSubmit").addClass('disabled');
                    $("#reportSpamCancel").unbind('click');
                    var jsonData = {
                        "organizerKey":$( "#organizerKey" ).text(),
                        "subscriptionToken":$("#subscriptionToken").text(),
                        "userEmail":$( "#attendeeEmail" ).text(),
                        "organizerEmail":$( "#organizerEmail" ).text(),
                        "details":{
                            "webinarId":$( "#webinarId" ).text()
                        }
                    };
                    var apiUrl =  $( "#brokerBaseUrl" ).text() + '/api/spaminfo';
                    if (browser.isIe() && browser.getVersion() <= 9) {
                    	apiUrl = '/api/spaminfo.json';
                    } 
                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url :apiUrl,
                        data: JSON.stringify(jsonData),
                        success: function() {
                            $("#reportSpamAndOptOutPage").hide();
                            $("#reportSpamConfirmationPage").show();
                        },
                        error: function () {
                            $("#reportSpamAndOptOutPage").hide();
                            $("#reportSpamErrorViewPage").show();
                        }
                    });
                });

                $("#reportSpamCancel").click(function() {
                	$("#reportSpamSubmit").unbind('click');
                    $("#reportSpamCancel").unbind('click');
                    $("#reportSpamAndOptOutPage").hide();
                    $("#reportSpamCancelPage").show();
                });
            }

        };

        if ( methods[ method ] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else if ( typeof method === "object" || !method ) {
            return methods.init.apply( this, arguments);
        } else {
            $.error( "Method '" +  method + "' does not exist in pluginName plugin!" );
        }

    };

}( $ ) );

$( document ).ready( function() {
    $.reportSpam("");
} );
