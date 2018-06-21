var url = window.location.href + "json";
var svg;
var svg1;

console.log(url)
require(["https://d3js.org/d3.v4.min.js"], function (d3) {
    jsonDATA = d3.json(url, function (error, data) {
        var width = document.getElementById("vis2").offsetWidth;
        var height = width * 0.9;

        //Dimensions and margins of the diagram
        var margin_horizontal = 90;
        var margin_vertical = 20;
        var zoomDepth = 1;
        var x_trans = 0;
        var y_trans = 0;
        var centerNode = 0;
        var x_diff = 0;
        var y_diff = 0;


        var widthScale = d3.scaleLinear().domain([1, 80]).range([1, 10]);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg1 = d3.select("#tree-container").append("svg").attr("width", width).attr("height", height).call(d3.zoom().on("zoom", function () {
            svg1.attr("transform", d3.event.transform)
            zoomDepth = d3.zoomTransform(this).k; //Get zoom depth
            y_trans = d3.zoomTransform(this).x; //Get drag correction horizontal
            x_trans = d3.zoomTransform(this).y; //Get drag correction vertical
            centerNode = 0; // no click
            update(root);
        })).append("g").attr("transform", "translate(" + margin_horizontal + "," + margin_vertical + ")");



        var i = 0,
            duration = 750,
            root;


        // declares a tree layout and assigns the size
        var treemap = d3.tree().size([height - (2 * margin_vertical), width - (2 * margin_horizontal)]);

        // Assigns parent, children, height, depth
        root = d3.hierarchy(data, function (d) {
            return d.children;
        });
        root.x0 = height / 2;
        root.y0 = 0;


        // Collapse after the second level
        root.children.forEach(collapse);


        update(root);

        // Collapse the node and all it's children
        function collapse(d) {
            if (d.children && d.depth > 1) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            } else if (d.children) {
                d.children.forEach(collapse);
            }
        }



        function update(source) {

            //document.getElementById(".node text").style.fontSize = "xx-small";

            // Assigns the x and y position for the nodes
            var data = treemap(root);



            // Compute the new tree layout.
            var nodes = data.descendants(),
                links = data.descendants().slice(1);

            // Normalize for fixed-depth
            nodes.forEach(function (d) {
                d.y = (d.depth * 200);
            });

            //Only after click
            if (centerNode == 1) {

                //Calculate correction to center source node
                x_diff = source.x - height / 2;
                y_diff = source.y - width / 2;

                //Change position of every node to correct drag and center source node
                nodes.forEach(function (d) {
                    d.y = (d.y - y_trans - y_diff);
                    d.x = (d.x - x_trans - x_diff);
                });

                //Calculate zoom correction
                x_diff = source.x - (source.x / zoomDepth);
                y_diff = source.y - (source.y / zoomDepth);

                //Apply zoom correction to each node
                nodes.forEach(function (d) {
                    d.y = d.y - y_diff;
                    d.x = d.x - x_diff;
                });
            }

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svg1.selectAll('g.node').data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append('g').attr('class', 'node').attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            }).on('click', click);

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // Remove any old circle
            svg1.selectAll("circle").remove();

            // Add Circle for the nodes
            nodeUpdate.append('circle').attr('class', 'node').attr('r', 1e-6).style("fill", function (d) {
                return d._children ? "#1B3A5E" : "#F96332";
            }).style("stroke-width", 3 / zoomDepth).style("stroke", "#1B3A5E");


            // Remove any old text
            svg1.selectAll("text").remove();

            // Only when tree has a certain size
            if (zoomDepth > 0.4) {
                // Add labels for the nodes
                nodeUpdate.append('text').style("font-size", 12 / zoomDepth + "px").attr("dy", ".35em").attr("x", function (d) {
                    return d.children || d._children ? -13 / zoomDepth : 13 / zoomDepth;
                }).attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                }).text(function (d) {
                    if (typeof d.data.name == "string") {

                        if (d.data.name.length < 20 * zoomDepth) {
                            if (d.data.name.length < 20 * zoomDepth || typeof d.data.name == "number") {
                                return d.data.name;
                            }
                        } else if (d.data.name.indexOf(' ') >= 0) {
                            var fields = d.data.name.split(' ');
                            if (fields[0].length < 17 * zoomDepth) {
                                return fields[0] + "...";
                            } else {
                                return d.data.name.substr(0, 17 * zoomDepth) + "...";
                            }
                        } else {
                            return d.data.name.substr(0, 17 * zoomDepth) + "...";
                        }

                    } else {
                        return "";
                    }
                }).style("fill", "#1B3A5E");
            }


            // Transition to the proper position for the node
            nodeUpdate.transition().duration(duration).attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });


            // Update the node attributes and style
            nodeUpdate.select('circle.node').attr('r', 10 / zoomDepth).style("fill", function (d) {
                return d._children ? "#1B3A5E" : "#F96332";
            }).attr('cursor', 'pointer');

            // Remove any exiting nodes
            var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            }).remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle').attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text').style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            var link = svg1.selectAll('path.link').data(links, function (d) {
                return d.id;
            }).style('stroke-width', 3 / zoomDepth);

            // Enter any new links at the parent's previous position.
            var linkEnter = link.enter().insert('path', "g").attr("class", "link").attr('d', function (d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal(o, o);
            }).style('stroke-width', 3 / zoomDepth);

            // UPDATE
            var linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition().duration(duration).attr('d', function (d) {
                return diagonal(d, d.parent);
            });

            // Remove any exiting links
            var linkExit = link.exit().transition().duration(duration).attr('d', function (d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal(o, o);
            }).style('stroke-width', 3 / zoomDepth).remove();

            // Store the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Creates a curved (diagonal) path from parent to the child nodes
            function diagonal(s, d) {

                path = 'M ' + s.y + ' ' + s.x + '\n            C ' + (s.y + d.y) / 2 + ' ' + s.x + ',\n              ' + (s.y + d.y) / 2 + ' ' + d.x + ',\n              ' + d.y + ' ' + d.x;

                return path;
            }



            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else if (d._children) {
                    d.children = d._children;
                    d._children = null;
                }
                centerNode = 1;
                update(d);
            }
        }

        var width = height * 0.9;
        var height = width * (1 / 0.9) + 6;
    });
});