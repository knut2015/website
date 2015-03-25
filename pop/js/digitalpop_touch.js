var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var el = document.querySelector("#hit");

var START_X = Math.round((window.innerWidth - el.offsetWidth) / 2);
var START_Y = Math.round((window.innerHeight - el.offsetHeight) / 2);

var ticking = false;
var transform;

var mc = new Hammer.Manager(el);

mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

mc.on("rotatestart rotatemove", onRotate);
mc.on("pinchstart pinchmove", onPinch);

mc.on("hammer.input", function(ev) {
    if(ev.isFinal) {
        // resetElement();
    }
});


function resetElement() {
    el.className = 'animate';
    transform = {
        translate: { x: START_X, y: START_Y },
        scale: 1,
        angle: 0,
        rx: 0,
        ry: 0,
        rz: 0
    };

    // requestElementUpdate();
}

function updateElementTransform() {
    var value = [
                'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
                'scale(' + transform.scale + ', ' + transform.scale + ')',
                'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
    ];

    value = value.join(" ");
    el.textContent = value;
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;
}

function requestElementUpdate() {
    if(!ticking) {
        reqAnimationFrame(updateElementTransform);
        ticking = true;
    }
}

var initScale = 1;
function onPinch(ev) {
    if(ev.type == 'pinchstart') {
        initScale = transform.scale || 1;
    }

    el.className = '';
    transform.scale = initScale * ev.scale;

    requestElementUpdate();
}

var initAngle = 0;
function onRotate(ev) {
    if(ev.type == 'rotatestart') {
        initAngle = transform.angle || 0;
    }

    el.className = '';
    transform.rz = 1;
    transform.angle = initAngle + ev.rotation;
    requestElementUpdate();
}

resetElement();