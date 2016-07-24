function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function snapshot() {
    var video = document.querySelector('video');
    var canvas = document.getElementById('camcanvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    //map2.loadDifferentImage(canvas.toDataURL('image/webp'))
}

function CameraField(new_parent_div) { 
    this.parent_div = new_parent_div;
    
    this.videoElement = document.createElement('video');
    this.videoElement.autoplay = true;
    // set autoplay
    this.parent_div.appendChild(this.videoElement);
    
    if (hasGetUserMedia()) {
        getUserMediaCrossBrowser = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);

        navigator.webkitGetUserMedia({
                video: true, 
                audio: false
            },

            function(localMediaStream) {
                this.videoElement.src = window.URL.createObjectURL(localMediaStream);
                // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
                // See crbug.com/110938.
                video.onloadedmetadata = function(e) {
                    console.log("Camera going!");
                };
            }.bind(this), function(e) {
                console.log('Reeeejected!', e);
            });
    }
    
    // The control points which represent the top-left, top-right and bottom
    // right of the image. These will be wires, via d3.js, to the handles
    // in the svg element.
    this.controlPoints = [{
        x: 100,
        y: 100
    }, {
        x: 400,
        y: 100
    }, {
        x: 100,
        y: 400
    }, {
        x: 400,
        y: 400
    }];
    this.controlHandlesElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.controlHandlesElement.style.width = 600 
    this.controlHandlesElement.style.height = 400
    this.parent_div.appendChild(this.controlHandlesElement);
    
    this.setupControlHandles(this.controlHandlesElement,      function() {});

}

CameraField.prototype.setupControlHandles = function(controlHandlesElement, onChangeCallback) {
    // Use d3.js to provide user-draggable control points
    this.rectDragBehav = d3.behavior.drag()
        .on('drag', function(d, i) {
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            d3.select(this).attr('cx', d.x).attr('cy', d.y);
            onChangeCallback();
        });

    console.log(this.controlPoints);
    this.dragT = d3.select(controlHandlesElement).selectAll('circle')
        .data(this.controlPoints)
        .enter().append('circle')
        .attr('cx', function(d) {
            return d.x;
        })
        .attr('cy', function(d) {
            return d.y;
        })
        .attr('fill', 'white')
        .attr('stroke', 'grey')
        .attr('r', 15)
        .attr('class', 'control-point')
        .call(this.rectDragBehav);
}

cam = new CameraField(document.getElementById('video'));
