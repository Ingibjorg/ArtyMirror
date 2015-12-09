function start(options) {
    var TColor = toxi.color.TColor;

    var palette = [
        TColor.newHex('1c0f17'),
        TColor.newHex('271d2e'),//.setBrightness(0.75),
        TColor.newHex('2c3857'),
        TColor.newHex('155e73').setBrightness(0.9),
        TColor.newHex('e8ca59'),
        TColor.newHex('891b1b')//.setAlpha(0.85),
        //TColor.newHex('35e8df')
    ];

    var canvas = document.getElementById('myCanvas'),
        ctx = canvas.getContext('2d'),
        offset = 0;

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
//ctx.fillRect(0,0,canvas.width,canvas.height);

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
            var angle = options.strength;
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
}