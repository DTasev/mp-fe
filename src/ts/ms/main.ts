interface IData {
    data: Uint8Array;
    offset: number;
}

let img: HTMLImageElement;
let imageData: ImageData;
let indata: IData, outdata: IData;
const f = Module.cwrap('myimage', null, ['number', 'number', 'number'])

function carray(arr) {
    // allocate the space
    const byteSize = 1;
    const offset = Module._malloc(arr.length * byteSize);
    Module.HEAPU8.set(arr, offset / byteSize);
    return {
        "data": Module.HEAPU8.subarray(offset / byteSize, offset / byteSize + arr.length),
        "offset": offset
    }
}

document.getElementById('myFile').onchange = function (evt: Event) {
    const tgt = evt.target || <HTMLInputElement>window.event.srcElement,
        files = (<any>tgt).files;

    // FileReader support
    if (FileReader && files && files.length) {
        const fr = new FileReader();
        fr.onload = () => showImage(fr);
        fr.readAsDataURL(files[0]);
    }
}

function showImage(fileReader) {
    img = <HTMLImageElement>document.getElementById("myImage");
    // img.onload = getImageData;
    img.src = fileReader.result;
}
let ctx;
function getImageData() {
    const canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    // important if the canvas size is not set then the full image will NOT be rendered
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);
    imageData = ctx.getImageData(0, 0, img.width, img.height);

    const newcanvas = document.createElement("canvas");
    document.body.appendChild(newcanvas);
    const newctx = newcanvas.getContext("2d");
    newctx.canvas.width = imageData.width;
    newctx.canvas.height = imageData.height;
    // newctx.putImageData(imageData, 0, 0);

    const normalArray = new Uint8Array(imageData.data);
    console.log("image data:", normalArray);
    indata = carray(normalArray);
    outdata = carray(new Uint8Array(normalArray.length / 4));
    f(indata.offset, outdata.offset, img.width, img.height);

    const newctxImageData = newctx.getImageData(0, 0, imageData.width, imageData.height);
    const ctxdata = newctxImageData.data;
    const imgheight = imageData.height;
    const imgwidth = imageData.width;
    const channels = 4;
    const actualwidth = imgwidth * channels;
    let row = 0;
    let col = 0;
    let coldata = 0;
    let pos;
    let posdata;
    let channel;
    for (row = 0; row < imgheight; ++row) {

        for (col = 0, coldata = 0; coldata < imgwidth; col += 4, coldata++) {

            pos = row * actualwidth + col;
            posdata = row * imgwidth + coldata;

            // red            
            ctxdata[pos] = outdata.data[posdata];
            // green
            ctxdata[pos + 1] = outdata.data[posdata];
            // blue
            ctxdata[pos + 2] = outdata.data[posdata];
            // alpha
            ctxdata[pos + 3] = 255;
        }
    }
    newctx.putImageData(newctxImageData, 0, 0);
}

// public method for encoding an Uint8Array to base64
function encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = [];
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output.push(keyStr.charAt(enc1), keyStr.charAt(enc2), keyStr.charAt(enc3), keyStr.charAt(enc4))
    }
    return output.join("");
}