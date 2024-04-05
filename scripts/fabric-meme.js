document.addEventListener('DOMContentLoaded', function () {
    const canvas = new fabric.Canvas('memeCanvas', {
        preserveObjectStacking: true
    });

    document.getElementById('imageInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            fabric.Image.fromURL(e.target.result, (img) => {
                const maxWidth = window.innerWidth - 20;
                const maxHeight = window.innerHeight - 20;
                const imgWidth = img.width;
                const imgHeight = img.height;

                const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
                const canvasWidth = imgWidth * scale;
                const canvasHeight = imgHeight * scale;

                canvas.setWidth(canvasWidth);
                canvas.setHeight(canvasHeight);

                img.scaleToWidth(canvasWidth);
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('stickerUpload').addEventListener('change', function (event) {
        const files = event.target.files;
        const stickersContainer = document.getElementById('stickers-container');

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.width = 100;
                imgElement.height = 100;
                imgElement.classList.add('sticker');
                imgElement.draggable = true;
                imgElement.ondragstart = (event) => {
                    event.dataTransfer.setData('text', e.target.result);
                };
                stickersContainer.appendChild(imgElement);
            };
            reader.readAsDataURL(files[i]);
        }
    });

    document.getElementById('addTextButton').addEventListener('click', function () {
        const text = new fabric.IText('Edit Me', {
            left: 100,
            top: 100,
            fontFamily: 'Arial',
            fill: '#000',
            fontSize: 24
        });
        canvas.add(text);
    });

    document.getElementById('generateButton').addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = canvas.toDataURL({ format: 'png', quality: 1 });
        link.download = 'meme.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    canvas.on('object:selected', (e) => {
        const selectedObject = e.target;
        selectedObject.set({
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 10,
            transparentCorners: false,
            cornerStyle: 'circle',
            borderScaleFactor: 2
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
            }
        }
    });

    canvas.getElement().ondrop = (event) => {
        event.preventDefault();
        const imageURL = event.dataTransfer.getData('text');
        fabric.Image.fromURL(imageURL, (img) => {
            img.set({
                left: event.layerX,
                top: event.layerY,
                angle: 0,
                padding: 10,
                cornersize: 10,
                hasRotatingPoint: true
            });
            canvas.add(img);
            canvas.setActiveObject(img);
        });
    };

    canvas.getElement().ondragover = (event) => {
        event.preventDefault();
    };
});
