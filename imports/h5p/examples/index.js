"use strict";
exports.__esModule = true;
exports["default"] = (function (model) { return "<html>\n<head>\n<meta charset=\"UTF-8\">\n</head>\n<body>\n<h3>Created/Uploaded Content</h3>\n<ul>\n" + model.contentIds
    .map(function (id) {
    return "<li>" + id + " <a href=\"/play?contentId=" + id + "\">[play]</a> <a href=\"/edit?contentId=" + id + "\">[edit]</a></li>";
})
    .join('') + "\n</ul>\n<h4><a href=\"/edit\">Create New Content</a></h4>\n<h3>Examples from H5P.org</h3>\n<i>Clicking on the examples will download the examples, copy them to the content and display them.</i>\n<ul>\n" + model.examples
    .map(function (example, i) { return "\n            <li><a href=\"examples/" + i + "\">" + example.library + ": " + example.name + "</a> \n            | <a href=\"" + example.page + "\">original</a></li>"; })
    .join('') + "\n</ul>\n</body>\n</html>"; });
//# sourceMappingURL=index.js.map