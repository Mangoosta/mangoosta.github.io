showdown.extension('MathJaxExt', function() {
    var matches = [];
    return [
        {
            type: 'lang',
            regex: /%mathstart%([^]+?)%mathend%/gi,
            replace: function(s, match) { 
                matches.push(match);
                var n = matches.length - 1;
                return '%PLACEHOLDER' + n + '%';
            }
        },
        {
            type: 'output',
            filter: function (text) {
                for (var i=0; i< matches.length; ++i) {
                    var pat = '<p>%PLACEHOLDER' + i + '% *<\/p>';
                    text = text.replace(new RegExp(pat, 'gi'), matches[i]);
                }
                matches = [];
                return text;
            }
        }
    ]
});

$(document).ready(function() {
    //alert(parent.mdcontent);

    var converter = new showdown.Converter({
                            extensions: ['MathJaxExt'],
                            'github_flavouring': true, 
                            'tables': true
                        });
    var converted = converter.makeHtml(parent.mdcontent);
    $("body").html(converted);

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./js/MathJax.js?config=TeX-AMS_HTML-full";
    document.getElementsByTagName("head")[0].appendChild(script);
});