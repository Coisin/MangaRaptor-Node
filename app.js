var request = require("request");
var fs = require("fs");
var archiver = require("archiver");
var http = require("http");
var server = http.createServer();

function getMatches(text, regex) {
  var match = regex.exec(text);
  var matches = [];
  while (match != null) {
      matches.push(match[0]);
      match = regex.exec(text);
  }
  return matches;
}

server.on("request", function(req, res) {
  var chapterUrl = "http://www.mangareader.net/spirit-blade-mountain/1";
  var baseUrl = "http://www.mangareader.net";

  var counter = 0;

  var siteHTML;

  var archive = archiver('zip', {
    store: true
  });

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

        archive.append(request(image), {name: counter+".jpg"});
        counter++;
        if(counter >= matches.length) {
          archive.pipe(res).on("close", function() {
            res.end();
          });
          archive.finalize();
        }

      });

    }
  });
});

server.listen(5000);
