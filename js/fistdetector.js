var duration = 30000;
var value = getParameterByName('value');

console.log("Here: " + value);

var circle = new ProgressBar.Circle('#progress', {
    strokeWidth: 15,
    color: '#FFFFFF',
    duration: duration,
    easing: 'easeInOut'

});

if (!value) {
    circle.set(value);
}

circle.animate(1, function() {
    window.location.href = '/winner.html';
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getScripts(urls, callback) {
    function getScript(url, callback) {
        var script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0],
            done = false;

        script.src = url;
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                callback();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };

        head.appendChild(script);
    }

    function getScriptCallback() {
        if (urls.length > 0) getScript(urls.shift(), getScriptCallback);
        else callback();
    }

    getScript(urls.shift(), getScriptCallback);
}

getScripts([
        '//mtschirs.github.io/js-objectdetect/examples/js/compatibility.js',
        '//mtschirs.github.io/js-objectdetect/js/objectdetect.js',
        '//mtschirs.github.io/js-objectdetect/js/objectdetect.handfist.js',
        '//mtschirs.github.io/js-objectdetect/examples/js/jquery.js'],

    function () {
        var canvas = $('<canvas style="position: fixed; z-index: 1001;top: 10px; right: 10px; opacity: 0.9">').get(0),
            context = canvas.getContext('2d');
        var video = document.createElement('video'),
            detector;

        document.getElementsByTagName('body')[0].appendChild(canvas);

        try {
            compatibility.getUserMedia({video: true}, function(stream) {
                try {
                    video.src = compatibility.URL.createObjectURL(stream);
                } catch (error) {
                    video.src = stream;
                }
                compatibility.requestAnimationFrame(play);
            }, function (error) {
                alert("WebRTC not available");
            });
        } catch (error) {
            alert(error);
        }

        var date = new Date();
        var timeSinceLastMovement = date.getTime();
        var fluidCanvas = $("#window1").get(0);

        function play() {
            compatibility.requestAnimationFrame(play);
            if (video.paused) video.play();

            if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {

                /* Prepare the detector once the video dimensions are known: */
                if (!detector) {
                    var width = ~~(80 * video.videoWidth / video.videoHeight);
                    var height = 80;
                    detector = new objectdetect.detector(width, height, 1.1, objectdetect.handfist);
                }

                /* Draw video overlay: */
                canvas.width = ~~(100 * video.videoWidth / video.videoHeight);
                canvas.height = 100;
                context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);

                var coords = detector.detect(video, 1);
                if (coords[0]) {
                    var coord = coords[0];
                    /* Rescale coordinates from detector to video coordinate space: */
                    coord[0] *= video.videoWidth / detector.canvas.width;
                    coord[1] *= video.videoHeight / detector.canvas.height;
                    coord[2] *= video.videoWidth / detector.canvas.width;
                    coord[3] *= video.videoHeight / detector.canvas.height;

                    /* Find coordinates with maximum confidence: */
                    var coord = coords[0];
                    for (var i = coords.length - 1; i >= 0; --i)
                        if (coords[i][4] > coord[4]) coord = coords[i];

                    /* Draw coordinates on video overlay: */
                    context.beginPath();
                    context.lineWidth = '2';
                    context.fillStyle = 'rgba(0, 255, 255, 0.5)';
                    context.fillRect(
                        coord[0] / video.videoWidth * canvas.clientWidth,
                        coord[1] / video.videoHeight * canvas.clientHeight,
                        coord[2] / video.videoWidth * canvas.clientWidth,
                        coord[3] / video.videoHeight * canvas.clientHeight);
                    context.stroke();

                    var x = coord[0] / video.videoWidth * fluidCanvas.clientWidth;
                    var y = coord[1] / video.videoHeight * fluidCanvas.clientHeight;

                    mouse.set(x, y);
                    mouseFluid.set((x / fluidCanvas.width * 2 - 1) * fluid.aspectRatio, (fluidCanvas.height - y) / fluidCanvas.height * 2 - 1);
                    mousePointKnown = true;
                    date = new Date();
                    timeSinceLastMovement = date.getTime();
                } else {
                    var date = new Date();
                    var currentTime = date.getTime();
                    var diff = currentTime - timeSinceLastMovement;

                    if (!isNaN(diff) && diff >= 4000) {
                        window.location.href = '/loser.html&value=' + circle.value();
                    }
                }
            }
        }
    }
);

