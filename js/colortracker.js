function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var timeout = setTimeout(redirectToLoser, 6000);
var circle;

function redirectToLoser() {
    window.location.href = '/loser.html?value=' + circle.value();
}

window.onload = function() {
    var duration = 20000;
    var value = getParameterByName('value');

    circle = new ProgressBar.Circle('#progress', {
        strokeWidth: 15,
        color: '#FFFFFF',
        duration: duration,
        easing: 'linear'
    });

    if (value) {
        circle.set(value);
    }

    circle.animate(1, function() {
        window.location.href = '/winner.html';
    });

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var tracker = new tracking.ColorTracker(['yellow']);
    tracking.track('#video', tracker, { camera: true });



    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            clearTimeout(timeout);
            timeout = setTimeout(redirectToLoser, 4000);

            var fluidCanvas = $("#window1").get(0);
            var x = rect.x / canvas.width * fluidCanvas.width;
            var y = rect.y / canvas.height * fluidCanvas.height;

            x = fluidCanvas.width - x;

            mouse.set(x, y);
            mouseFluid.set((x / fluidCanvas.width * 2 - 1) * fluid.aspectRatio, (fluidCanvas.height - y) / fluidCanvas.height * 2 - 1);
            mousePointKnown = true;
        });
    });
};
