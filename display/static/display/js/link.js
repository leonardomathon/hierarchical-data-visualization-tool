// This function fakes a click on a certain element
function simClick(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}
// Prints the clicked id
$(document).click(function (event) {
    var id = ($(event.target)[0].id);
    if (id.startsWith("vis1_")) {
        mimicVis2(id);
    }
    if (id.startsWith("vis2_")) {
        mimicVis2(id);
    }
});
function mimicVis1(id) {
    var clean = id.replace('vis2_', 'vis1_');
    simClick(document.getElementById(clean), 'click');
}
function mimicVis2(id) {
    var clean = id.replace('vis1_', 'vis2_');
    simClick(document.getElementById(clean), 'click');
}
// function click() {
//     simClick(document.getElementById('vis2_3804'), 'click');
    // simClick(document.getElementById('vis1_3804'), 'click');
// }

// setTimeout(click, 5000);