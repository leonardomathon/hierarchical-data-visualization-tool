// Get json file of current dataset
var url = window.location.href + "json";

// Require in the d3v3 library
require(["https://d3js.org/d3.v3.min.js"], function (d3) {

    // Set margin of the svg
    var margin = {
            top: (document.getElementById("vis2").offsetWidth) / 2,
            right: document.getElementById("vis2").offsetWidth / 2,
            bottom: (document.getElementById("vis2").offsetWidth) / 2,
            left: document.getElementById("vis2").offsetWidth / 2
        },
        radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;

    // Function to determine if text should be displayed
    function filter_min_arc_size_text(d, i) {
        return (d.dx * d.depth * radius / 2) > 14
    };

    // Coloring and luminance
    var hue = d3.scale.category20();

    var luminance = d3.scale.linear()
        .domain([0, 1e6])
        .clamp(true)
        .range([95, 1]);

    // Put graph in right div
    var svg = d3.select("#vis2").append("svg")
        .attr("width", margin.left + margin.right)
        .attr("height", margin.top + margin.bottom)
        .attr('id', 'svgvis2')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var partition = d3.layout.partition()
        .sort(function (a, b) {
            return b.value - a.value;
        })
        .size([2 * Math.PI, radius]);

    var arc = d3.svg.arc()
        .startAngle(function (d) {
            return d.x;
        })
        .endAngle(function (d) {
            return d.x + d.dx - .01 / (d.depth + .5);
        })
        .innerRadius(function (d) {
            return radius / 3 * d.depth;
        })
        .outerRadius(function (d) {
            return radius / 3 * (d.depth + 1) - 1;
        });

    //Tooltip description
    var tooltip = d3.select("#label")
        .append("div")
        .attr("id", "tooltip")
        .style("color", "#f96332")
        .style("opacity", 0)
        .style("z-index", "100000");

    // Legend
    function format_description(d) {
        var description = d.description;
        _seq = "";
        while (typeof d.parent != "undefined") {
            if (typeof d.name == "number") {
                _seq = "junction " + " / " + _seq;
            } else {
                _seq = d.name + " / " + _seq;
            }
            d = d.parent
        }
        if (typeof d.name == "number") {
            _seq = " " + " / " + _seq;
        } else {
            _seq = d.name + " / " + _seq;
        }
        return _seq;
    }

    function computeTextRotation(d) {
        var angle = (d.x + d.dx / 2) * 180 / Math.PI - 90
        return angle;
    }

    function mouseOverArc(d) {
        tooltip.html(format_description(d));
        return tooltip.transition()
            .duration(50)
            .style("opacity", 0.9);
    }

    function mouseOutArc() {
        d3.select(this).attr("stroke", "")
        return tooltip.style("opacity", 0);
    }

    function mouseMoveArc(d) {
        return tooltip
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    }

    var root_ = null;
    d3.json(url, function (error, root) {
        if (error) return console.warn(error);
        // Compute the initial layout on the entire tree to sum sizes.
        // Also compute the full name and fill color for each node,
        // and stash the children so they can be restored as we descend.

        partition
            .value(function (d) {
                return d.branch_length;
            })
            .nodes(root)
            .forEach(function (d) {
                d._children = d.children;
                // See which scale to use
                d.sum = d.value;
                d.key = key(d);
                d.fill = fill(d);
            });

        // Define how many layers get drawn
        partition
            .children(function (d, depth) {
                return depth < 2 ? d._children : null;
            })
            .value(function (d) {
                return d.sum;
            });

        if (typeof root.name == "string") {
            var centerNode = "\n\n" + root.name;
        } else {
            var centerNode = "";
        }

        var center = svg.append("circle")
            .attr("r", radius / 3)
            .attr("fill", "white")
            .on("click", zoomOut);

        center.append("title")
            .text("Zoom Out" + centerNode);

        var partitioned_data = partition.nodes(root).slice(1)

        var path = svg.selectAll("path")
            .data(partitioned_data)
            .enter().append("path")
            .attr("d", arc)
            .attr("id", function (d) {
                return "vis2_" + d.name;
            })
            .style("fill", function (d) {
                return d.fill;
            })
            .each(function (d) {
                this._current = updateArc(d);
            })
            .attr("depth", function (d) {
                return d.depth;
            })
            .on("click", zoomIn)
            .on("mouseover", mouseOverArc)
            .on("mousemove", mouseMoveArc)
            .on("mouseout", mouseOutArc);

        var texts = svg.selectAll("text")
            .data(partitioned_data)
            .enter().append("text")
            .filter(filter_min_arc_size_text)
            .attr("transform", function (d) {
                return "rotate(" + computeTextRotation(d) + ")";
            })
            .attr("x", function (d) {
                return radius / 3 * d.depth;
            })
            .attr("dx", "6") // margin
            .attr("dy", ".35em") // vertical-align
            .text(function (d, i) {
                if (typeof d.name == "number") {
                    return "";
                } else if (d.name.length < 11) {
                    return d.name;
                } else if (d.name.indexOf(' ') >= 0) {
                    var fields = d.name.split(' ');
                    if (fields[0].length < 8) {
                        return fields[0] + "...";
                    } else {
                        return d.name.substr(0, 7) + "...";
                    }
                } else {
                    return d.name.substr(0, 7) + "...";
                }
            });

        function zoomIn(p) {
            if (p.depth > 1) p = p.parent;
            if (!p.children) return;
            if (typeof root.name == "string") {
                centerNode = "\n\n" + p.name;
            }
            zoom(p, p);
        }

        function zoomOut(p) {
            if (!p.parent) return;
            if (typeof root.name == "string") {
                centerNode = "\n\n" + p.parent.name;
            }
            zoom(p.parent, p);
        }
        function clearSvg() {
            var a = document.getElementById('svgvis2');
            var circles = a.getElementsByTagName('circle');
            var length = circles.length - 1;
            console.log(length);
            circles[length].remove()
        }
        // Zoom to the specified new root.
        function zoom(root, p) {
            var center = svg.append("circle")
                .attr("r", radius / 3)
                .attr("fill", "white")
                .attr("id", "zoom_" + p.name)
                .on("click", zoomOut)

            center.append("title")
                .text("Zoom Out" + centerNode);
            
            if (document.documentElement.__transition__) return;

            // Rescale outside angles to match the new layout.
            var enterArc,
                exitArc,
                outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

            function insideArc(d) {
                return p.key > d.key ? {
                    depth: d.depth - 1,
                    x: 0,
                    dx: 0
                } : p.key < d.key ? {
                    depth: d.depth - 1,
                    x: 2 * Math.PI,
                    dx: 0
                } : {
                    depth: 0,
                    x: 0,
                    dx: 2 * Math.PI
                };
            }

            function outsideArc(d) {
                return {
                    depth: d.depth + 1,
                    x: outsideAngle(d.x),
                    dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)
                };
            }

            center.datum(root);

            // When zooming in, arcs enter from the outside and exit to the inside.
            // Entering outside arcs start from the old layout.
            if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

            var new_data = partition.nodes(root).slice(1)

            path = path.data(new_data, function (d) {
                return d.key;
            });

            // When zooming out, arcs enter from the inside and exit to the outside.
            // Exiting outside arcs transition to the new layout.
            if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);

            d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function () {
                path.exit().transition()
                    .style("fill-opacity", function (d) {
                        return d.depth === 1 + (root === p) ? 1 : 0;
                    })
                    .attrTween("d", function (d) {
                        return arcTween.call(this, exitArc(d));
                    })
                    .remove();
                path.enter().append("path")
                    .style("fill-opacity", function (d) {
                        return d.depth === 2 - (root === p) ? 1 : 0;
                    })
                    .style("fill", function (d) {
                        return d.fill;
                    })
                    .on("click", zoomIn)
                    .on("mouseover", mouseOverArc)
                    .on("mousemove", mouseMoveArc)
                    .on("mouseout", mouseOutArc)
                    .attr("id", function (d) {
                        return "vis2_" + d.name;
                    })
                    .each(function (d) {
                        this._current = enterArc(d);
                    });

                path.transition()
                    .style("fill-opacity", 1)
                    .attrTween("d", function (d) {
                        return arcTween.call(this, updateArc(d));
                    });
            });


            texts = texts.data(new_data, function (d) {
                return d.key;
            })

            texts.exit()
                .remove()
            texts.enter()
                .append("text")

            texts.style("opacity", 0)
                .attr("transform", function (d) {
                    return "rotate(" + computeTextRotation(d) + ")";
                })
                .attr("x", function (d) {
                    return radius / 3 * d.depth;
                })
                .attr("dx", "6") // margin
                .attr("dy", ".35em") // vertical-align
                .filter(filter_min_arc_size_text)
                .text(function (d, i) {
                    if (typeof d.name == "number") {
                        return "";
                    } else if (d.name.length < 11) {
                        return d.name;
                    } else if (d.name.indexOf(' ') >= 0) {
                        var fields = d.name.split(' ');
                        if (fields[0].length < 8) {
                            return fields[0] + "...";
                        } else {
                            return d.name.substr(0, 7) + "...";
                        }
                    } else {
                        return d.name.substr(0, 7) + "...";
                    }
                })
                .transition().delay(750).style("opacity", 1)
        }
    });

    function key(d) {
        var k = [],
            p = d;
        while (p.depth) k.push(p.name), p = p.parent;
        return k.reverse().join(".");
    }

    function fill(d) {
        var p = d;
        while (p.depth > 1) p = p.parent;
        var c = d3.lab(hue(p.name));
        c.l = luminance(d.sum);
        return c;
    }

    function arcTween(b) {
        var i = d3.interpolate(this._current, b);
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }

    function updateArc(d) {
        return {
            depth: d.depth,
            x: d.x,
            dx: d.dx
        };
    }
});