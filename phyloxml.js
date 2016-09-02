function parsePhyloXML(path) {
    var xml = loadXML(path);
    var root = xml.documentElement.firstElementChild;
    return walk(root);
    
    function loadXML(path) {
        var req = new XMLHTTPRequest();
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
        for (var child of node.children) {
            if (child.tag == "clade") {
                descr.subnodes.push(walk(child, {}));
            } else if (child.tag == "branch_length") {
                descr.length = parseFloat(child.firstChild.data);
            } else if (child.tag == "name") {
                descr.name = child.firstChild.data;
            }
        }
        return descr;
    }
}
