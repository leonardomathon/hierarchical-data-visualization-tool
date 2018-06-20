//var data = require("http://localhost:8000/display/1/json")
var url = window.location.href + "json";
var svg;
var svg1;

console.log(url)
 jsonDATA = d3.json(url, function(error, data) {
   var width = document.getElementById("vis2").offsetWidth;
   var height = width*0.9;

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
        zoomDepth = d3.zoomTransform(this).k;   //Get zoom depth
        y_trans = d3.zoomTransform(this).x; //Get drag correction horizontal
        x_trans = d3.zoomTransform(this).y; //Get drag correction vertical
        centerNode = 0; // no click
        update(root);
    })).append("g").attr("transform", "translate(" + margin_horizontal + "," + margin_vertical + ")");



    var i = 0,
    duration = 750,
    root;


    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height- (2 * margin_vertical), width - (2 * margin_horizontal)]);

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
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
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
            d.y = (d.depth * 200) ;
        });

        //Only after click
        if (centerNode == 1){

            //Calculate correction to center source node
            x_diff = source.x - height /  2;
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
            return d._children ?  "#1B3A5E" : "#F96332";
        }).style("stroke-width", 3 / zoomDepth).style("stroke", "#1B3A5E");


        // Remove any old text
        svg1.selectAll("text").remove();

        // Only when tree has a certain size
        if (zoomDepth > 0.4){
        // Add labels for the nodes
        nodeUpdate.append('text').style("font-size", 12 / zoomDepth + "px").attr("dy", ".35em").attr("x", function (d) {
            return d.children || d._children ? -13 / zoomDepth : 13 / zoomDepth;
        }).attr("text-anchor", function (d) {
            return d.children || d._children ? "end" : "start";
        }).text(function (d) {
          if (typeof d.data.name == "string")  {

            if(d.data.name.length < 20 * zoomDepth) {
             if (d.data.name.length < 20 * zoomDepth || typeof d.data.name == "number") {
                return d.data.name;
            }}
            else if (d.data.name.indexOf(' ') >= 0) {
                var fields = d.data.name.split(' ');
                if (fields[0].length < 17 * zoomDepth) {
                    return fields[0] + "...";
                }
                else {
                    return d.data.name.substr(0, 17 * zoomDepth) + "...";
                }
            }
            else {
                return d.data.name.substr(0, 17 * zoomDepth) + "...";
            }

            } else {
            d.data.name = "";
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
            var o = { x: source.x0, y: source.y0 };
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
            var o = { x: source.x, y: source.y };
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
            } else if(d._children) {
                d.children = d._children;
                d._children = null;
            } 
            centerNode = 1;
            update(d);
        }
    }

var width = height*0.9;
var height = width*(1/0.9)+6;

// SECOND VIZ
    //  var data = error;
     console.log(data)
     console.log(data.children.length + 1)
    // var d3 = window.d3v5
    var color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    var format = d3.format(",d");
//     if (document.getElementById("vis2").offsetWidth < 700) {
//             var width = ("width", 200);
//     } else {

    var radius = width / 6;
    var arc = d3.arc().startAngle(function (d) {
        return d.x0;
    }).endAngle(function (d) {
        return d.x1;
    }).padAngle(function (d) {
        return Math.min((d.x1 - d.x0) / 2, 0.005);
    }).padRadius(radius * 1.5).innerRadius(function (d) {
        return d.y0 * radius;
    }).outerRadius(function (d) {
        return Math.max(d.y0 * radius, d.y1 * radius - 1);
    });
    var partition = function partition(data) {
        var root = d3.hierarchy(data).sum(function (d) {
            if(d.type == "leaf" || (typeof d.type == 'undefined')) {
                return d.branch_length;
            }
            else {
                return 0.0;
            }
        }).sort(function (a, b) {
            return b.value - a.value;
        });
        return d3.partition().size([2 * Math.PI, root.height + 1])(root);
    };
    var chart = function chart()  {
        var root = partition(data);
        root.each(function (d) {
            return d.current = d;
        });
        svg = d3.select("#vis2").append("svg:svg")
            .style("width", width)
            .style("height", height)
            .style("font", "10px sans-serif")
            .style("display", "block")
            .style("margin", "auto");
        var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");
        var path = g.append("g").selectAll("path").data(root.descendants().slice(1)).enter().append("path").attr("fill", function (d) {
            while (d.depth > 1) {
                d = d.parent;
            }return color(d.data.name);
        }).attr("fill-opacity", function (d) {
            return arcVisible(d.current) ? d.children ? 0.6 : 0.4 : 0;
        }).attr("d", function (d) {
            return arc(d.current);
        });
        path.filter(function (d) {
            return d.children;
        }).style("cursor", "pointer").on("click", clicked);
        path.append("title").text(function (d) {
            return d.ancestors().map(function (d) {
                return d.data.name;
            }).reverse().join("/") + "\n" + format(d.value);
        });
        var label = g.append("g").attr("pointer-events", "none").attr("text-anchor", "middle").style("user-select", "none").selectAll("text").data(root.descendants().slice(1)).enter().append("text").attr("dy", "0.35em").attr("fill-opacity", function (d) {
            return +labelVisible(d.current);
        }).attr("transform", function (d) {
            return labelTransform(d.current);
        }).text(function (d) {
            if (typeof d.data.name == "number") {
				return "";
			}
			else if (d.data.name.length < 16) {
				return d.data.name;
			}
			else if (d.data.name.indexOf(' ') >= 0) {
				var fields = d.data.name.split(' ');
				if (fields[0].length < 13) {
					return fields[0] + "...";
				}
				else {
					return d.data.name.substr(0, 12) + "...";
				}
			}
			else {
				return d.data.name.substr(0, 12) + "...";
			}
		});
        var parent = g.append("circle").datum(root).attr("r", radius).attr("fill", "none").attr("pointer-events", "all").on("click", clicked);
        function clicked(p) {
            parent.datum(p.parent || root);
            root.each(function (d) {
                return d.target = {
                    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    y0: Math.max(0, d.y0 - p.depth),
                    y1: Math.max(0, d.y1 - p.depth)
                };
            });
            var t = g.transition().duration(750);
            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t).tween("data", function (d) {
                var i = d3.interpolate(d.current, d.target);
                return function (t) {
                    return d.current = i(t);
                };
            }).filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            }).attr("fill-opacity", function (d) {
                return arcVisible(d.target) ? d.children ? 0.6 : 0.4 : 0;
            }).attrTween("d", function (d) {
                return function () {
                    return arc(d.current);
                };
            });
            label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t).attr("fill-opacity", function (d) {
                return +labelVisible(d.target);
            }).attrTween("transform", function (d) {
                return function () {
                    return labelTransform(d.current);
                };
            });
        }
        function arcVisible(d) {
            return d.y1 <= 3 && d.y0 >= 0 && d.x1 > d.x0;
        }
        function labelVisible(d) {
            return d.y1 <= 3 && d.y0 >= 0 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }
        function labelTransform(d) {
            var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            var y = (d.y0 + d.y1) / 2 * radius;
            if(x == 180) {
                return "rotate(" + (0) + ") translate(" + (0) + ", " + (y) + ")";
            } else {
                return "rotate(" + (x - 90) + ") translate(" + y + ",0) rotate(" + (x < 180 ? 0 : 180) + ")";
            }
        }
        return svg.node();
    }

    // Set-up the export button Viz 2
    d3.select('#saveButton2').on('click', function(){
    	var svgString = getSVGString(svg.node());
    	svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback

    	function save( dataBlob, filesize ){
    		saveAs( dataBlob, 'Visualization2.png' ); // FileSaver.js function
    	}
    });

    // Below are the functions that handle actual exporting:
    // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
    function getSVGString( svgNode ) {
    	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    	var cssStyleText = getCSSStyles( svgNode );
    	appendCSS( cssStyleText, svgNode );

    	var serializer = new XMLSerializer();
    	var svgString = serializer.serializeToString(svgNode);
    	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    	return svgString;

    	function getCSSStyles( parentElement ) {
    		var selectorTextArr = [];

    		// Add Parent element Id and Classes to the list
    		selectorTextArr.push( '#'+parentElement.id );
    		for (var c = 0; c < parentElement.classList.length; c++)
    				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
    					selectorTextArr.push( '.'+parentElement.classList[c] );

    		// Add Children element Ids and Classes to the list
    		var nodes = parentElement.getElementsByTagName("*");
    		for (var i = 0; i < nodes.length; i++) {
    			var id = nodes[i].id;
    			if ( !contains('#'+id, selectorTextArr) )
    				selectorTextArr.push( '#'+id );

    			var classes = nodes[i].classList;
    			for (var c = 0; c < classes.length; c++)
    				if ( !contains('.'+classes[c], selectorTextArr) )
    					selectorTextArr.push( '.'+classes[c] );
    		}

    		// Extract CSS Rules
    		var extractedCSSText = "";
    		for (var i = 0; i < document.styleSheets.length; i++) {
    			var s = document.styleSheets[i];

    			try {
    			    if(!s.cssRules) continue;
    			} catch( e ) {
    		    		if(e.name !== 'SecurityError') throw e; // for Firefox
    		    		continue;
    		    	}

    			var cssRules = s.cssRules;
    			for (var r = 0; r < cssRules.length; r++) {
    				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
    					extractedCSSText += cssRules[r].cssText;
    			}
    		}


    		return extractedCSSText;

    		function contains(str,arr) {
    			return arr.indexOf( str ) === -1 ? false : true;
    		}

    	}

    	function appendCSS( cssText, element ) {
    		var styleElement = document.createElement("style");
    		styleElement.setAttribute("type","text/css");
    		styleElement.innerHTML = cssText;
    		var refNode = element.hasChildNodes() ? element.children[0] : null;
    		element.insertBefore( styleElement, refNode );
    	}
    }


    function svgString2Image( svgString, width, height, format, callback ) {
    	var format = format ? format : 'png';

    	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    	var canvas = document.createElement("canvas");
    	var context = canvas.getContext("2d");

    	canvas.width = width;
    	canvas.height = height;

    	var image = new Image();
    	image.onload = function() {
    		context.clearRect ( 0, 0, width, height );
    		context.drawImage(image, 0, 0, width, height);

    		canvas.toBlob( function(blob) {
    			var filesize = Math.round( blob.length/1024 ) + ' KB';
    			if ( callback ) callback( blob, filesize );
    		});


    	};

    	image.src = imgsrc;
    }



    // button Viz 1

    d3.select('#saveButton1').on('click', function(){
            	var svgString2 = getsvgString2(svg.node());
            	svgString2Image2( svgString2, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback

            	function save2( dataBlob, filesize2 ){
            		saveAs( dataBlob, 'Visualization1.png' ); // FileSaver.js function
            	}
            });

        // Below are the functions that handle actual exporting:
        // getsvgString2 ( svgNode ) and svgString22Image( svgString2, width, height, format, callback )
        function getsvgString2( svgNode ) {
        	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        	var cssStyleText = getCSSStyles2( svgNode );
        	appendCSS2( cssStyleText, svgNode );

        	var serializer = new XMLSerializer();
        	var svgString2 = serializer.serializeToString(svgNode);
        	svgString2 = svgString2.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
        	svgString2 = svgString2.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

        	return svgString2;

        	function getCSSStyles2( parentElement ) {
        		var selectorTextArr = [];

        		// Add Parent element Id and Classes to the list
        		selectorTextArr.push( '#'+parentElement.id );
        		for (var c = 0; c < parentElement.classList.length; c++)
        				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
        					selectorTextArr.push( '.'+parentElement.classList[c] );

        		// Add Children element Ids and Classes to the list
        		var nodes = parentElement.getElementsByTagName("*");
        		for (var i = 0; i < nodes.length; i++) {
        			var id = nodes[i].id;
        			if ( !contains('#'+id, selectorTextArr) )
        				selectorTextArr.push( '#'+id );

        			var classes = nodes[i].classList;
        			for (var c = 0; c < classes.length; c++)
        				if ( !contains('.'+classes[c], selectorTextArr) )
        					selectorTextArr.push( '.'+classes[c] );
        		}

        		// Extract CSS Rules
        		var extractedCSSText = "";
        		for (var i = 0; i < document.styleSheets.length; i++) {
        			var s = document.styleSheets[i];

        			try {
        			    if(!s.cssRules) continue;
        			} catch( e ) {
        		    		if(e.name !== 'SecurityError') throw e; // for Firefox
        		    		continue;
        		    	}

        			var cssRules = s.cssRules;
        			for (var r = 0; r < cssRules.length; r++) {
        				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
        					extractedCSSText += cssRules[r].cssText;
        			}
        		}


        		return extractedCSSText;

        		function contains(str,arr) {
        			return arr.indexOf( str ) === -1 ? false : true;
        		}

        	}

        	function appendCSS2( cssText, element ) {
        		var styleElement = document.createElement("style");
        		styleElement.setAttribute("type","text/css");
        		styleElement.innerHTML = cssText;
        		var refNode = element.hasChildNodes() ? element.children[0] : null;
        		element.insertBefore( styleElement, refNode );
        	}
        }


        function svgString2Image2( svgString2, width, height, format, callback ) {
        	var format = format ? format : 'png';

        	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString2 ) ) ); // Convert SVG string to data URL

        	var canvas = document.createElement("canvas");
        	var context = canvas.getContext("2d");

        	canvas.width = width;
        	canvas.height = height;

        	var image = new Image();
        	image.onload = function() {
        		context.clearRect ( 0, 0, width, height );
        		context.drawImage(image, 0, 0, width, height);

        		canvas.toBlob( function(blob) {
        			var filesize = Math.round( blob.length/1024 ) + ' KB';
        			if ( callback ) callback( blob, filesize );
        		});
        	};

        	image.src = imgsrc;
        }
    window.onload = chart();
});
