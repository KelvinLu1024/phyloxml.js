function parsePhyloXML(path) {
  var xml = loadXML(path);
  var root = xml.documentElement.firstElementChild;
  var json = walk(root);
  return json;
  
  function loadXML(path) {
    var req = new XMLHttpRequest();
    var xml = null;
    req.addEventListener("load", function(){
      xml = this.responseXML;
    });
    req.open("GET", path, false);
    req.send();
    return xml;
  }

  function walk(node) {
    var descr = {};
    descr.subnodes = [];
    var blen = node.attributes["branch_length"];
    if (blen == undefined) {
      for (var child of node.children) {
        switch (child.tagName) {
          case "clade":
            descr.subnodes.push(walk(child, {}));
            break;
          case "branch_length":
            descr.length = parseFloat(child.firstChild.data);
            break;
          case "name":
            descr.name = child.firstChild.data;
            break;
          case "taxonomy":
            for (var e of child.children) {
              if (e.tagName == "name") {
                descr.name = e.firstChild.data;
                break;
              }
            }
            break;
        }
      }
    } else {
      descr.length = parseFloat(blen.value);
      for (var child of node.children) {
        if (child.tagName == "clade") {
          descr.subnodes.push(walk(child, {}));
        } else if (child.tagName == "name") {
          descr.name = child.firstChild.data;
        }
      }
    }
    descr.name = descr.name || "";
    descr.length = descr.length || 1;
    //descr.length = 1;
    return descr;
  }
}
