function latexify() {
  var body = DocumentApp.getActiveDocument().getBody();

  var gray_color = "#a8a8a8";
  var note_marker = "%";
  var beginre = /\\begin{(\w+)}/;
  var endre = /\\end{(\w+)}/;

  var headingmappings = {
    "\\section{": DocumentApp.ParagraphHeading.HEADING1,
    "\\subsection{": DocumentApp.ParagraphHeading.HEADING2,
    "\\subsubsection{": DocumentApp.ParagraphHeading.HEADING3,
    "\\paragraph{": DocumentApp.ParagraphHeading.HEADING3
  };

  var paragraphs = body.getParagraphs();
  var beginname = "";
  var endname = "";

  paragraphs.forEach(function(p) {
    var str = p.getText();

    Object.keys(headingmappings).forEach(function(key) {
      if (str.indexOf(key) != 0) {
        return;
      }
      var style = {};
      style[DocumentApp.Attribute.HEADING] = headingmappings[key];
      p.setAttributes(style);
    });

    if (!beginname) {
      var beginmatches = beginre.exec(str);
      if (beginmatches) {
        var name = beginmatches[1];
        if (name != "document") {
          beginname = name;
        }
      }
    }

    var note = str.indexOf(note_marker) == 0;

    if (beginname || note) {
      var style = {};
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = gray_color;
      p.setAttributes(style);
    }

    var endmatches = endre.exec(str);
    if (endmatches) {
      endname = endmatches[1];
    }

    if (beginname && beginname == endname) {
      Logger.log("Found end tag for being tag: " + endname);
      beginname = "";
      endname = "";
    }
  });
}

function onOpen() {
  var ui = DocumentApp.getUi();
  var menu = ui.createAddonMenu();
  menu.addItem("Latex Syntax Highlight", "latexify").addToUi();
}
