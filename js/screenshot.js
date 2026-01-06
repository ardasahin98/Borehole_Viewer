document.getElementById('capture-btn').addEventListener('click', function() {
    // Select the div you want to capture
    let captureElement = document.getElementById('capture-div');

    // Convert all dynamically injected SVGs to Canvas using canvg
    let svgElements = captureElement.querySelectorAll('svg');
    let svgPromises = [];

    svgElements.forEach(function(svgElement) {
        svgPromises.push(new Promise(function(resolve) {
            let canvas = document.createElement('canvas');

            // Fallback for width and height if clientWidth and clientHeight are 0
            let width = svgElement.clientWidth || svgElement.getAttribute('width') || 100;
            let height = svgElement.clientHeight || svgElement.getAttribute('height') || 100;

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');

            // Convert the SVG element into a string and render it into the canvas
            const v = canvg.Canvg.fromString(ctx, new XMLSerializer().serializeToString(svgElement));

            v.render().then(() => {
                // Replace the SVG element with the newly created canvas
                svgElement.replaceWith(canvas);
                resolve();
            });
        }));
    });

    // Wait for all SVGs to be converted before capturing the screenshot
    Promise.all(svgPromises).then(function() {
        // Use dom-to-image-more to capture the div and download as a PNG
        domtoimage.toPng(captureElement, { useCORS: true })
            .then(function(dataUrl) {
                // Create a temporary link to download the image
                let link = document.createElement('a');
                link.href = dataUrl;
                let file_name = String($('#file_name').val());
                link.download = file_name + '.jpeg';  // The file name for the downloaded image
                link.click();  // Simulate a click to trigger the download
            })
            .catch(function(error) {
                console.error('Error capturing screenshot:', error);
            });
    });
});