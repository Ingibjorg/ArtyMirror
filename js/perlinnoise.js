// Counter for 2 minute tooth brushing
var count = 20;
var counter;

function start(options) {
    counter = setInterval(timer, 1000); //1000 will  run it every 1 second
    var canvas = document.getElementById('perlinCanvas'),
        ctx = canvas.getContext('2d'),
        offset = 0;

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
        drawStuff(canvas, options, ctx, offset);
    }

    resizeCanvas();
    timer();
}

function timer() {
    count = count - 1;
    if (count <= 0) {
        clearInterval(counter);
        // Happens after 2 minutes
        $("#perlinCanvas").hide();
        document.getElementById("succEnding").style.visibility = "visible";
        document.getElementById("succEnding").style.display = "block";
    }
}

function drawStuff(canvas, options, ctx, offset) {
    var TColor = toxi.color.TColor;
    var perlin = perlin = new toxi.math.noise.PerlinNoise();

    var palette = [
        TColor.newHex('3C0CFF'),
        TColor.newHex('9100FD'),//.setBrightness(0.75),
        TColor.newHex('FF00FF'),
        //TColor.newHex('FF7676'),
        //TColor.newHex('76FFE4'),
        //TColor.newHex('FF00E6')//.setAlpha(0.85),
    ];

    var streams = [];
    var getRandomVector = function () {
        var vec = new toxi.geom.Vec2D(Math.random() * canvas.width, Math.random() * canvas.height);
        //since javascript is a loose-typed language, im just gonna through a color property on there
        vec.color = palette[parseInt(Math.random() * palette.length, 10)];
        return vec;
    };

    for (var i = 0; i < options.numStreams; i++) {
        streams.push(getRandomVector());
    }
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1.5;

    var draw = function () {
        while (options.numStreams > streams.length) {
            streams.push(getRandomVector());
        }
        while (options.numStreams < streams.length) {
            streams.shift();
        }
        offset += options.distort;
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var replaceIndices = [];
        var lastPos = new toxi.geom.Vec2D();
        streams.forEach(function (stream, i) {
            window._col = stream.color;
            ctx.strokeStyle = stream.color.toRGBACSS();
            lastPos.set(stream);
            var noise = perlin.noise(stream.x * options.scaler, offset + stream.y * options.scaler) - 0.5;
            var angle = options.strength * noise;
            var dir = toxi.geom.Vec2D.fromTheta(angle);

            stream.addSelf(dir.normalizeTo(options.step * 3));
            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(stream.x, stream.y);
            ctx.closePath();
            ctx.stroke();
            if (stream.x < 0 || stream.x > canvas.width || stream.y < 0 || stream.y > canvas.height) {
                replaceIndices.push(i);
            }
        });
        replaceIndices.forEach(function (streamIndex) {
            streams[streamIndex] = getRandomVector();
        });

        setTimeout(draw, 1000 / 30);
    };

    setTimeout(draw, 1000 / 30);

    function decreaseSpeed() {
        if (options.step >= 0.25) {
            options.step -= 0.1;
        }
    }

    setInterval(decreaseSpeed, 1000 / 30);
}