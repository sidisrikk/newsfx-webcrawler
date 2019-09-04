var Crawler = require("crawler");

const newsForexUrl = 'https://www.forexfactory.com/calendar.php';

// TODO adjust timezone later
const TIMEZONE_SHIFT = 1 // in hour


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
                var time = String($('.calendar__time', b).text().trim());
                var currency = String($('.currency', b).text().replace(/\n/g, '').trim());
                var title_news = $('.calendar__event', b).text().trim();
                var impactLevel = $('.calendar__impact span', b).attr("class");

                // remember for empty time data
                if(String(date) != "")
                tmpDuplicateDate = date
                if(String(time) != "")
                    tmpDuplicateTime = time

                if (String(time) == "" && (String(currency) == ""))
                    return;
                
                // combine date and time into one
                const tmp = {
                    'date': tmpDuplicateDate,
                    'time': tmpDuplicateTime,
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