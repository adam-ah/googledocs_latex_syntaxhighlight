function latexify() {
  const gray_color = "#a8a8a8";
  const note_marker = "%";
  const command_marker = "\\";
  const beginre = /\\begin{(\w+)}/;
  const endre = /\\end{(\w+)}/;

  const headingmappings = [
    "\\section{",
    DocumentApp.ParagraphHeading.HEADING1,
    "\\subsection{",
    DocumentApp.ParagraphHeading.HEADING2,
    "\\subsubsection{",
    DocumentApp.ParagraphHeading.HEADING3,
    "\\paragraph{",
    DocumentApp.ParagraphHeading.HEADING4
  ];
  
  const protectedbegins = [
    "document",
    "itemize",
    "APAitemize",
    ];

  const protectedcommands = [
    "abstract",
    "abstracttext",
    "affiliation",
    "author",
    "item",
    "journal",
    "keywords",
    "note",
    "parencite",
    "shorttitle",
    "textbf",
    "textbf",
    "textcite",
    "textit",
    "textit",
    "textmd",
    "textrm",
    "textsc",
    "textsf",
    "textsl",
    "texttt",
    "textup",
    "title",
  ];
  
  const body = DocumentApp.getActiveDocument().getBody();
  const paragraphs = body.getParagraphs();

  var beginname = "";
  var endname = "";

  paragraphs.forEach(function(p) {
    var str = p.getText();

    for (var i = 0; i < headingmappings.length; i += 2) {
      var key = headingmappings[i];
      var stylevalue = headingmappings[i + 1];
      if (str.indexOf(key) != 0) {
        continue;
      }
      var style = {};
      style[DocumentApp.Attribute.HEADING] = stylevalue;
      p.setAttributes(style);
      return;
    }

    if (!beginname) {
      var beginmatches = beginre.exec(str);
      if (beginmatches) {
        var name = beginmatches[1];
        if (protectedbegins.indexOf(name) == -1) {
          beginname = name;
        }
      }
    }

    var note = str.indexOf(note_marker) == 0;

    var command = false;
    if (str.indexOf(command_marker) == 0) {
      command = !protectedcommands.some(function(pc){return str.indexOf(pc) == 1});
    }

    if (beginname || note || command) {
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
  const ui = DocumentApp.getUi();
  const menu = ui.createAddonMenu();
  menu.addItem("Latex Syntax Highlight", "latexify").addToUi();
}
