function startFistDetection() {
    var options = {
        running: true,
        numStreams: 400,
        distort: 0,
        strength:  Math.PI,
        scaler: 0.05,
        step: 2
    };

    start(options);

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
                context = canvas.getContext('2d'),
                video = document.createElement('video'),
                fist_pos_old,
                detector;

            document.getElementsByTagName('body')[0].appendChild(canvas);

            video.src = camvideo.src;
            compatibility.requestAnimationFrame(play);

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

                        /* Scroll window: */
                        var fist_pos = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];
                        if (fist_pos_old) {
                            var dx = (fist_pos[0] - fist_pos_old[0]) / video.videoWidth,
                                dy = (fist_pos[1] - fist_pos_old[1]) / video.videoHeight;
                            dx *= -1.0;
                            if (options.step + dx <= 10 && options.step + dx >= 0) {
                                options.step += dx;
                            }
                        } else fist_pos_old = fist_pos;

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
                    } else fist_pos_old = null;
                }
            }
        }
    );
}