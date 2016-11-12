var request = require("request");
var fs = require("fs");

var chapterUrl = "http://www.mangareader.net/spirit-blade-mountain/1";
var baseUrl = "http://www.mangareader.net";

var counter = 0;

var siteHTML;
request(chapterUrl, function(err, data) {
  siteHTML = data.body;

  var expression = /<option value="\/spirit-blade-mountain\/(\d+)\/(\d+)">(\d+)<\/option>/g
  var matches = getMatches(siteHTML, expression);

  for(var i in matches) {
    var match = matches[i];
    var url = baseUrl + /<option value="(.*?)">/g.exec(match)[1];

    request(url, function(err, data) {

      var imagePageHTML = data.body;
      var imageExpression = /<img(.*?)id="img"(.*?)src="(.*?)"/g;
      var image = imageExpression.exec(imagePageHTML)[3];

      request(image).pipe(fs.createWriteStream(counter+".jpg"));

      counter++;

    });

  }

});

function getMatches(text, regex) {
  var match = regex.exec(text);
  var matches = [];
  while (match != null) {
      matches.push(match[0]);
      match = regex.exec(text);
  }
  return matches;
}
