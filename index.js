var Crawler = require("crawler");
var moment = require("moment");

const newsForexUrl = 'https://www.forexfactory.com/calendar.php';

const TIMEZONE_DIFF = 11 // in hour


let data = [];
var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let tmpDuplicateTime;
            let tmpDuplicateDate;
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $(".calendar__row").each(function (a, b) {
                var date = String($('.calendar__date', b).text().trim());
                var time = String($('.calendar__time', b).text().trim()).toLocaleLowerCase();
                var currency = String($('.currency', b).text().replace(/\n/g, '').trim());
                var title_news = $('.calendar__event', b).text().trim();
                var impactLevel = $('.calendar__impact span', b).attr("class");

                // remember for empty time data
                if (String(date) != "")
                    tmpDuplicateDate = date
                if (String(time) != "")
                    tmpDuplicateTime = time

                if (String(time) == "" && (String(currency) == ""))
                    return;


                // parsing string
                let datetimeTmp = time;
                if (tmpDuplicateTime.match("[0-9]{1,2}:[0-9]{2}(am|pm)")) {
                    const timeOnlyTmp = tmpDuplicateTime.replace(/(am|pm)/, "")
                    const ampmTmp = tmpDuplicateTime.substr(-2, 2)
                    const dayTmp = tmpDuplicateDate.split(' ')[1];
                    const monthTmp = tmpDuplicateDate.substr(3, 3);
                    const yrsTmp = new Date().getFullYear();
                    datetimeTmp = moment(`${dayTmp}-${monthTmp}-${yrsTmp} ${timeOnlyTmp} ${ampmTmp}`, 'D-MMM-YYYY h:mm a')
                        .add(TIMEZONE_DIFF, 'hours').toISOString();
                }

                // combine date and time into one
                const tmp = {
                    'time': datetimeTmp,
                    'currency': currency,
                    'title_news': title_news,
                    'impactLevel': impactLevel
                };
                data.push(tmp)
                console.log(tmp)

            });
        }

        done();
    }
});


c.queue(newsForexUrl);