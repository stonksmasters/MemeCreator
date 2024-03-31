document.addEventListener('DOMContentLoaded', function () {
    const canvas = new fabric.Canvas('memeCanvas', {
        preserveObjectStacking: true // Ensures the layer order is preserved when selected
    });

    document.getElementById('imageInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            fabric.Image.fromURL(e.target.result, (img) => {
                img.scaleToWidth(canvas.width);
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        };
        reader.readAsDataURL(file);
    });
    

    document.getElementById('stickerUpload').addEventListener('change', function (event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fabric.Image.fromURL(e.target.result, (img) => {
                    // Calculate the scale ratio to resize the image to 100x100 while maintaining aspect ratio
                    const scale = Math.min(100 / img.width, 100 / img.height);
                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        left: 50 + i * 100, // You might want to adjust this for better positioning
                        top: 50 + i * 50,  // You might want to adjust this for better positioning
                    });
                    canvas.add(img);
                });
            };
            reader.readAsDataURL(files[i]);
        }
    });
    
    

    // Add interactive text to canvas
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
    

    // Download the meme
    document.getElementById('generateButton').addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = canvas.toDataURL({ format: 'png', quality: 1 });
        link.download = 'meme.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Add event listener for selecting objects
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

    // Add keyboard event listener to delete selected objects
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
            }
    
        }
    });
});
