var mdcontent = "";
var editor, compiled;
var localClipboard = "";
var showpreview = true;

$(document).ready(function(){
  editor = CodeMirror.fromTextArea(textareasource, {
    mode: "markdown",
    lineNumbers: true,
    lineWrapping: false,
    theme : 'neat'
  });
	$(window).resize(resize);
	Program.main();
	resize();
});

function resize(){
  var toolbarHeight = $("#toolbar").height();
  var menuHeight = $("#mainmenu").height();
  var bodyHeight = $(window).height()-toolbarHeight-menuHeight-2;

  $("#source").css({"top": toolbarHeight+menuHeight-0});
  $("#source").css({"left": 5});
  $("#source").css({"height": bodyHeight});
  $("#source").css({"margin-top": 0});
  $("#source").css({"margin-left": 1});

  $("#preview").css({"top": toolbarHeight+menuHeight});
  $("#preview").css({"margin-top": 0});
  $("#preview").css({"height": bodyHeight});

  $("#textareasource").css({"left": 0});
  $("#textareasource").css({"top": 0});
  $("#textareasource").css({"width": $("#source").width()});
  $("#textareasource").css({"height": $("#source").height()});

  editor.setSize($("#source").width(), $("#source").height());

  $("#ifrmpreview").css({"left": 0});
  $("#ifrmpreview").css({"top": 0});
  $("#ifrmpreview").css({"width": $("#preview").width()});
  $("#ifrmpreview").css({"height": $("#preview").height()});

  $("#previewtextarea").css({"left": 0});
  $("#previewtextarea").css({"top": 0});
  $("#previewtextarea").css({"width": $("#preview").width()});
  $("#previewtextarea").css({"height": $("#preview").height()});
}

function generate(){
  mdcontent = editor.getValue();
  $("#ifrmpreview").attr("src", "./math.html").load(function() {
    $("#previewtextarea").val(document.getElementById('ifrmpreview').contentWindow.document.body.innerHTML);
  });
}

function insertBlackLineAtCursor(){
  var doc = editor.getDoc();
  var cursor = editor.getCursor(); // gets the line number in the cursor position
  var line = editor.getLine(cursor.line); // get the line contents
  var pos = { // create a new object to avoid mutation of the original selection
      line: cursor.line,
      ch: line.length // set the character position to the end of the line
  }
  editor.replaceRange('\n', pos); // adds a new line
}


function insertBlackLineAtLine(line){
  var doc = editor.getDoc();
  var cursor = editor.getCursor(); // gets the line number in the cursor position
  var line = editor.getLine(cursor.line); // get the line contents
  var pos = { // create a new object to avoid mutation of the original selection
      line: cursor.line,
      ch: line.length // set the character position to the end of the line
  }
  editor.replaceRange('\n', pos); // adds a new line
}

function switchPreviewArea()
{
  showpreview = !showpreview;

  if (showpreview)
  {
    $("#ifrmpreview").show();
    $("#previewtextarea").hide();
    $('#btnpreview i').removeClass('fa fa-desktop').addClass('fa fa-pencil-square-o'); 
  }
  else
  {
    $("#previewtextarea").show();
    $("#ifrmpreview").hide();
    $('#btnpreview i').removeClass('fa fa-pencil-square-o').addClass('fa fa-desktop');
  }
}

function generateZip(){
  JSZipUtils.getBinaryContent('./math.zip', function(err, data) {
      if(err) {
        throw err;
      }
      var zip = new JSZip(data);
      zip.file("ayuda/index.md", mdcontent);
      var content = zip.generate({type:"blob"});
      saveAs(content, "proyecto.zip");
    });
}
