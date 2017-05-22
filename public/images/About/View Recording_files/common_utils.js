/**
 * Created by sarim on 8/8/14.
 */

//Convert the epoch time received from the API to PST time

$.convertEpochTime=function (millis, timeZone, dateFormat) {

    try {

        return moment(millis).tz(timeZone).format(dateFormat);
    } catch(error) {

        return moment(millis).tz("GMT").format(dateFormat);

    }


}