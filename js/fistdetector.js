function startFistDetection() {
    document.getElementById("unsuccEnding").style.visibility = "hidden";
    document.getElementById("unsuccEnding").style.display = "none";
    $("#layer2").hide();
    document.getElementById("finish").style.visibility = "hidden";
    document.getElementById("finish").style.display = "none";

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var tracker = new tracking.ColorTracker(['yellow']);
    tracking.track('#video', tracker, { camera: true });

    tracking.ColorTracker.registerColor('orange', function(r, g, b) {
        if (r <= 250 & g <= 230 && b <= 230) {
            return true;
        }
        return false;
    });

    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            if (rect.color === 'custom') {
                rect.color = tracker.customColor;
            }
            context.strokeStyle = rect.color;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
    });

    initGUIControllers(tracker);

                    //    var date = new Date();
                    //    var currentTime = date.getTime();
                    //    var diff = currentTime - timeSinceLastMovement;
                    //
                    //    if (!isNaN(diff) && diff >= 4000 && !paused) {
                    //        paused = true;
                    //        video.pause();
                    //        $("canvas").hide();
                    //        document.getElementById("unsuccEnding").style.visibility = "visible";
                    //        document.getElementById("unsuccEnding").style.display = "block";
                    //        $("#layer2").show();
                    //        $("#instructions").show();
                    //        document.getElementById("instructions-text").style.visibility = "hidden";
                    //        document.getElementById("instructions-text").style.display = "none";
                    //        document.getElementById("finish-text").style.visibility = "visible";
                    //        document.getElementById("finish-text").style.display = "block";
                    //        fistDetectorStarted = false;
                    //        animate();
                    //        circle.stop();
                    //    }
                    //}
}
