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
    var depth = $(event.target)[0]["attributes"][4]
    console.log(open);
    
    if (id.startsWith("vis1_")) {
        if (!open) {
            vis2Zoomout()
        } else if (open) {
            mimicVis2(id);
        }
    }
});
$("#vis2").click(function (event) {
    // Get ID of clicked node
    var id = ($(event.target)[0].id);
    console.log(id);
    // See if clicked node is open or closed
    mimicVis1(id);
    if (id.startsWith("vis2_")) {
    }
});
function vis2Zoomout() {
    simClick(document.getElementById("zoomout"), 'click');
}

function mimicVis1(id) {
    var clean = id.replace('vis2_', 'vis1_');
    console.log(clean);
    simClick(document.getElementById(clean), 'click');
}
function mimicVis2(id) {
    var clean = id.replace('vis1_', 'vis2_');   
    simClick(document.getElementById(clean), 'click');
}


