/**
 * Created by sarim on 8/5/14.
 */
$.loadMessages = function (locale,callbackFunc) {

        jQuery.i18n.properties({
            name: '-g2wAtt-ui',
            path: '/messages/messages',
            mode: 'both',
            language: locale,
            callback: callbackFunc

        });

}
