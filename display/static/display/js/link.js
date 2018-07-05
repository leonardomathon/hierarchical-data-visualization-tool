// This function fakes a click on a certain element
function simClick(elem, event) {
    try {
        var clickEvent = new Event(event); // Create the event.
        elem.dispatchEvent(clickEvent); // Dispatch the event.
    } catch (err) {
        console.log("There was an error with the data link");
    }
}
// Prints the clicked id
$("#tree-container").click(function (event) {
    try {
        // Get ID of clicked node
        var id = ($(event.target)[0].id);

        // See if clicked node is open or closed
        var type = ($(event.target)[0]).getAttribute('type');
        if (id.startsWith("vis1_")) {
            if (type == 'open') {
                vis2Zoomout(id)
            } else {
                mimicVis2(id);
            }
        }
    } catch (err) {

    }

});
$("#vis2").click(function (event) {
    try {
        var id = ($(event.target)[0].id);
        console.log(id);
        if (id.startsWith("vis2_")) {
            mimicVis1(id)
        }
        if (id.startsWith('zoom_')) {
            vis1Zoomout(id);
        }
    } catch (err) {
        console.log('There was an error with the data link')
    }
    // Get ID of clicked node

});

function vis1Zoomout(id) {
    var clean = id.replace('zoom_', 'vis1main_');
    simClick(document.getElementById(clean), 'click');
}

function vis2Zoomout(id) {
    var element = document.getElementById('zoomout');
    var clean = id.replace('vis1_', 'zoom_')
    simClick(document.getElementById(clean), 'click');
}

function mimicVis1(id) {
    var clean = id.replace('vis2_', 'vis1main_');
    simClick(document.getElementById(clean), 'click');
}

function mimicVis2(id) {
    var clean = id.replace('vis1_', 'vis2_');
    simClick(document.getElementById(clean), 'click');
}