function returnDataURL1() {
    html2canvas(document.getElementById('tree-container')).then(function (canvas) {
        // Convert the canvas element to dataURL
        var myImage = canvas.toDataURL("image/png");

        // Convert the dataURL to Blob using the function below
        var myBlob = dataURLConverter(myImage);

        // Import filesaver and create blob
        var FileSaver = require(["https://cdn.rawgit.com/eligrey/FileSaver.js/e9d941381475b5df8b7d7691013401e171014e89/FileSaver.min.js"])
        var blob = new Blob([myBlob], {
            type: "image/png;charset=utf-8"
        });

        // Save the blob to the users computer
        saveAs(blob, "Export_visualization1.png");
    });
}

function returnDataURL2() {
    html2canvas(document.getElementById('vis2')).then(function (canvas) {
        // Convert the canvas element to dataURL
        var myImage = canvas.toDataURL("image/png");

        // Convert the dataURL to Blob using the function below
        var myBlob = dataURLConverter(myImage);

        // Import filesaver and create blob
        var FileSaver = require(["https://cdn.rawgit.com/eligrey/FileSaver.js/e9d941381475b5df8b7d7691013401e171014e89/FileSaver.min.js"])
        var blob = new Blob([myBlob], {
            type: "image/png;charset=utf-8"
        });

        // Save the blob to the users computer
        saveAs(blob, "Export_visualization2.png");
    });
}

// To use filesaver, we need to convert the DataURL to Blob
function dataURLConverter(dataURI) {
    // to binary data
    var binaryData = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // Create buffer
    var buffer = new ArrayBuffer(binaryData.length);
    var ia = new Uint8Array(buffer);
    for (var i = 0; i < binaryData.length; i++) {
        ia[i] = binaryData.charCodeAt(i);
    }
    var blob = new Blob([buffer], {
        type: mimeString
    });
    return blob;
}