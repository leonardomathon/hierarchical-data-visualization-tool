// This function fakes a click on a certain element
function simClick(elem, event) {
    // try {
        
    // } catch (err) {
    //     console.log("There was an error with the data link");
        
    // }
    var clickEvent = new Event(event); // Create the event.
    elem.dispatchEvent(clickEvent); // Dispatch the event.
    
}
// Prints the clicked id
$("#tree-container").click(function (event) {
    // Get ID of clicked node
    var id = ($(event.target)[0].id);
    // See if clicked node is open or closed
    var open = $(event.target)[0]["attributes"][3]
    if (id.startsWith("vis1_")) {
        if (open == "true") {
            console.log("Zoom out");
        } else {
            mimicVis2(id);
        }
    }
});
function vis2Zoomout() {
    simClick(document.getElementById("zoom-out"), 'click');
}

function mimicVis1(id) {
    var clean = id.replace('vis2_', 'vis1_');
    simClick(document.getElementById(clean), 'click');
}
function mimicVis2(id) {
    var clean = id.replace('vis1_', 'vis2_');
    simClick(document.getElementById(clean), 'click');
}


