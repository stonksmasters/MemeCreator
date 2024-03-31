// Shared sticker functionality for both meme generator and Twitter banner creator
class StickerManager {
    constructor(canvasId, imageInputId, generateButtonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stickers = [];
        this.selectedSticker = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.resizeOffsetX = 0;
        this.resizeOffsetY = 0;
        this.uploadedImage = null;

        document.getElementById(imageInputId).addEventListener('change', (e) => this.handleImageUpload(e));
        document.getElementById(generateButtonId).addEventListener('click', () => this.downloadImage());

        this.initializeCanvas();
    }

    initializeCanvas() {
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));
        this.canvas.addEventListener('dragover', (e) => e.preventDefault());
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
    }

    updateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.uploadedImage) {
            this.ctx.drawImage(this.uploadedImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        this.drawStickers();
    }

    handleImageUpload(event) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.updateCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    addSticker(imgSrc, x, y) {
        const img = new Image();
        img.onload = () => {
            this.stickers.push({ img, x, y, width: img.width, height: img.height });
            this.updateCanvas();
        };
        img.src = imgSrc;
    }

    drawStickers() {
        this.stickers.forEach((sticker) => {
            this.ctx.drawImage(sticker.img, sticker.x, sticker.y, sticker.width, sticker.height);
        });
    }

    handleDrop(e) {
        e.preventDefault();
        const x = e.clientX - this.canvas.getBoundingClientRect().left;
        const y = e.clientY - this.canvas.getBoundingClientRect().top;
        const imgSrc = e.dataTransfer.getData('text/plain');
        this.addSticker(imgSrc, x, y);
    }

    handleMouseDown(e) {
        // Implement logic for selecting, dragging, resizing stickers
    }

    handleMouseMove(e) {
        // Implement logic for moving and resizing stickers
    }

    handleMouseUp() {
        this.isDragging = false;
        this.isResizing = false;
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Export the StickerManager class to be used in different scripts
// export { StickerManager };
