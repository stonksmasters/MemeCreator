document.addEventListener('DOMContentLoaded', function() {
    const canvas = new fabric.Canvas('memeCanvas');
    let backgroundImg;

    document.getElementById('imageUpload').addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
                backgroundImg = img;
                img.set({
                    scaleX: canvas.width / img.width,
                    scaleY: canvas.height / img.height
                });
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    document.getElementById('addText').addEventListener('click', function() {
        const text = new fabric.IText('Hello World!', {
            left: 50,
            top: 50,
            fontFamily: 'Arial',
            fill: '#333',
            fontSize: 24
        });
        canvas.add(text);
    });

    document.getElementById('downloadMeme').addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL({format: 'png', quality: 1});
        link.click();
    });
});
