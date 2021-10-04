class Magnet {
    private WIDTH: number
    private HEIGHT: number
    private X: number
    private Y: number
    private IMG: HTMLImageElement
    private APP: HTMLElement
    private option: number
    constructor(src: string, app: HTMLElement, option?: number) {
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
    rotate(ctx: CanvasRenderingContext2D, deg: number): void {
        ctx.translate(this.X, this.Y);
        ctx.rotate(deg);
        ctx.translate(-this.X, -this.Y);
        ctx.drawImage(this.IMG, 0, 0);
        ctx.translate(this.X, this.Y);
        ctx.rotate(-deg);
        ctx.translate(-this.X, -this.Y);
    }
    mkMagnet(): void {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;
        this.rotate(ctx, 0);
        canvas.addEventListener('mousemove', this.mouseMoveCell.bind(this));
        this.APP.appendChild(canvas);
    }
    rmMagnet(): void {
        const children = this.APP.children;
        this.APP.removeChild(children[children.length - 1]);
    }
    mouseMove(e: MouseEvent) {
        if (this.option !== 2) return;
        const posX: number = e.clientX;
        const posY: number = e.clientY;
        for (let index: number = 0; index < this.APP.children.length; index++) {
            const canvas: HTMLCanvasElement = <HTMLCanvasElement>this.APP.children[index];
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            const canvasX: number = canvas.offsetLeft + this.X;
            const canvasY: number = canvas.offsetTop + this.Y;
            ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            this.rotate(ctx, Math.atan2(posY - canvasY, posX - canvasX));
            // ctx.drawImage(this.IMG, 0, 0);
        }
    }
    mouseMoveCell(e: MouseEvent) {
        if (this.option !== 1) return;
        const posX: number = e.clientX;
        const posY: number = e.clientY;
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>e.target;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        const canvasX: number = canvas.offsetLeft + this.X;
        const canvasY: number = canvas.offsetTop + this.Y;
        ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.rotate(ctx, Math.atan2(posY - canvasY, posX - canvasX));
    }
    setOption(option: number): void {
        this.option = option;
    }
    changeImage(src: string): void {
        this.IMG.src = src;
    }
}
let magnet: Magnet = null;
let cellLength: number = 0;
let setting_height: number = 0;
window.onload = function () {
    const app = document.getElementById('app');
    magnet = new Magnet('./arrow.svg', app);
    app.addEventListener('imgLoaded',function (event: Event): void {
        setting_height = document.getElementById('setting').offsetHeight;
        for (let index: number = 0; index < cellLength; index++) {
            magnet.rmMagnet();
        }
        cellLength = Math.floor(window.innerWidth / 100) * Math.round((window.innerHeight - setting_height) / 100);
        for (let index: number = 0; index < cellLength; index++) {
            magnet.mkMagnet();
        }
    });
    window.addEventListener('resize', function (): void {
        setting_height = document.getElementById('setting').offsetHeight;
        const before = cellLength;
        cellLength = Math.floor(window.innerWidth / 100) * Math.round((window.innerHeight - setting_height) / 100);
        for (let index: number = 0; index < Math.abs(before - cellLength); index++) {
            before > cellLength ? magnet.rmMagnet() : magnet.mkMagnet();
        }
    });
    document.getElementById('mode1').addEventListener('click', function () {
        magnet.setOption(1);
    });
    document.getElementById('mode2').addEventListener('click', function () {
        magnet.setOption(2);
    });
    document.getElementById('samples').addEventListener('change', function (event: Event) {
        magnet.changeImage((<HTMLInputElement>event.target).value);
    });
    document.getElementById('file').addEventListener('change', function (event: Event) {
        magnet.changeImage(URL.createObjectURL((<HTMLInputElement>event.target).files[0]));
    })
}