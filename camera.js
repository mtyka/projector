function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var errorCallback = function(e) {
    console.log('Reeeejected!', e);
};

function snapshot() {
    var video = document.querySelector('video');
    var canvas = document.getElementById('camcanvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    map2.loadDifferentImage(canvas.toDataURL('image/webp'))
}

// Not showing vendor prefixes.
if (hasGetUserMedia()) {
    getUserMediaCrossBrowser = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);

    navigator.webkitGetUserMedia({
            video: {
                optional: [{
                    sourceId: 0
                }]
            },
            audio: false
        },

        function(localMediaStream) {
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);

            video.addEventListener('click', snapshot, false);
            setInterval(snapshot, 100);

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function(e) {
                console.log("Camera going!");
            };
        }, errorCallback);

}