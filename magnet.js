var Magnet = /** @class */ (function () {
    function Magnet(src, app, option) {
        this.WIDTH = 100;
        this.HEIGHT = 100;
        this.X = this.WIDTH / 2;
        this.Y = this.HEIGHT / 2;
        this.IMG = new Image();
        this.IMG.src = src;
        this.APP = app;
        this.option = option === undefined ? 1 : option;
        this.IMG.addEventListener('load', function () {
            this.APP.dispatchEvent(new CustomEvent('imgLoaded'));
        }.bind(this), false);
        this.APP.addEventListener('mousemove', this.mouseMove.bind(this));
    }
    Magnet.prototype.rotate = function (ctx, deg) {
        ctx.translate(this.X, this.Y);
        ctx.rotate(deg);
        ctx.translate(-this.X, -this.Y);
        ctx.drawImage(this.IMG, 0, 0);
        ctx.translate(this.X, this.Y);
        ctx.rotate(-deg);
        ctx.translate(-this.X, -this.Y);
    };
    Magnet.prototype.mkMagnet = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;
        this.rotate(ctx, 0);
        canvas.addEventListener('mousemove', this.mouseMoveCell.bind(this));
        this.APP.appendChild(canvas);
    };
    Magnet.prototype.rmMagnet = function () {
        var children = this.APP.children;
        this.APP.removeChild(children[children.length - 1]);
    };
    Magnet.prototype.mouseMove = function (e) {
        if (this.option !== 2)
            return;
        var posX = e.clientX;
        var posY = e.clientY;
        for (var index = 0; index < this.APP.children.length; index++) {
            var canvas = this.APP.children[index];
            var ctx = canvas.getContext('2d');
            var canvasX = canvas.offsetLeft + this.X;
            var canvasY = canvas.offsetTop + this.Y;
            ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            this.rotate(ctx, Math.atan2(posY - canvasY, posX - canvasX));
            // ctx.drawImage(this.IMG, 0, 0);
        }
    };
    Magnet.prototype.mouseMoveCell = function (e) {
        if (this.option !== 1)
            return;
        var posX = e.clientX;
        var posY = e.clientY;
        var canvas = e.target;
        var ctx = canvas.getContext('2d');
        var canvasX = canvas.offsetLeft + this.X;
        var canvasY = canvas.offsetTop + this.Y;
        ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.rotate(ctx, Math.atan2(posY - canvasY, posX - canvasX));
    };
    Magnet.prototype.setOption = function (option) {
        this.option = option;
    };
    Magnet.prototype.changeImage = function (src) {
        this.IMG.src = src;
    };
    return Magnet;
}());
var magnet = null;
var cellLength = 0;
var setting_height = 0;
window.onload = function () {
    var app = document.getElementById('app');
    magnet = new Magnet('./arrow.svg', app);
    app.addEventListener('imgLoaded', function (event) {
        setting_height = document.getElementById('setting').offsetHeight;
        for (var index = 0; index < cellLength; index++) {
            magnet.rmMagnet();
        }
        cellLength = Math.floor(window.innerWidth / 100) * Math.round((window.innerHeight - setting_height) / 100);
        for (var index = 0; index < cellLength; index++) {
            magnet.mkMagnet();
        }
    });
    window.addEventListener('resize', function () {
        setting_height = document.getElementById('setting').offsetHeight;
        var before = cellLength;
        cellLength = Math.floor(window.innerWidth / 100) * Math.round((window.innerHeight - setting_height) / 100);
        for (var index = 0; index < Math.abs(before - cellLength); index++) {
            before > cellLength ? magnet.rmMagnet() : magnet.mkMagnet();
        }
    });
    document.getElementById('mode1').addEventListener('click', function () {
        magnet.setOption(1);
    });
    document.getElementById('mode2').addEventListener('click', function () {
        magnet.setOption(2);
    });
    document.getElementById('samples').addEventListener('change', function (event) {
        magnet.changeImage(event.target.value);
    });
    document.getElementById('file').addEventListener('change', function (event) {
        magnet.changeImage(URL.createObjectURL(event.target.files[0]));
    });
};
