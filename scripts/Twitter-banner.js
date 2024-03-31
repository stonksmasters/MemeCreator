// Get all category links and category elements
const categoryLinks = document.querySelectorAll('.category-link');
const categories = document.querySelectorAll('.category');

// Add click event listeners to category links
categoryLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const selectedCategory = link.getAttribute('data-category');
        categories.forEach(category => category.classList.remove('active'));
        document.querySelector(`.category[data-category="${selectedCategory}"]`).classList.add('active');
    });
});

// Trigger default category
document.querySelector('.category-link[data-category="funny"]').click();

// Canvas setup
const canvas = document.getElementById('twitterBannerCanvas');
const ctx = canvas.getContext('2d');
let stickers = [], selectedSticker = null, isDragging = false, isResizing = false, uploadedImage = null;
canvas.width = 1500;
canvas.height = 500;

// Function to get mouse position relative to the canvas
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) * (canvas.width / rect.width),
        y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
}

// Image upload handler
document.getElementById('bannerImageInput').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        uploadedImage = new Image();
        uploadedImage.onload = resizeCanvas;
        uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});

// Function to draw sticker border and controls (resize and delete)
function drawStickerBorderAndControls(sticker) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);

    // Draw resize control (e.g., bottom-right corner)
    ctx.fillStyle = 'green';
    ctx.fillRect(sticker.x + sticker.width - 10, sticker.y + sticker.height - 10, 10, 10);

    // Draw delete control (e.g., top-left corner)
    ctx.fillStyle = 'red';
    ctx.fillRect(sticker.x, sticker.y, 10, 10);
}

// Check if a point is inside the resize control of a sticker
function isInsideResizeControl(sticker, x, y) {
    return x >= sticker.x + sticker.width - 10 && x <= sticker.x + sticker.width &&
           y >= sticker.y + sticker.height - 10 && y <= sticker.y + sticker.height;
}

// Check if a point is inside the delete control of a sticker
function isInsideDeleteControl(sticker, x, y) {
    return x >= sticker.x && x <= sticker.x + 10 && y >= sticker.y && y <= sticker.y + 10;
}

// Function to update the canvas
function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (uploadedImage) ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
    stickers.forEach(sticker => {
        ctx.drawImage(sticker.img, sticker.x, sticker.y, sticker.width, sticker.height);
        if (sticker === selectedSticker) {
            drawStickerBorderAndControls(sticker);
        }
    });
}

// Function to check if a point is inside a sticker
function isInsideSticker(sticker, x, y) {
    return x >= sticker.x && x <= sticker.x + sticker.width && y >= sticker.y && y <= sticker.y + sticker.height;
}

// Mouse event handling
let dragOffsetX = 0, dragOffsetY = 0;
canvas.addEventListener('mousedown', function (e) {
    const { x, y } = getMousePos(e);
    selectedSticker = null;
    isDragging = false;
    isResizing = false;

    for (let i = stickers.length - 1; i >= 0; i--) {
        const sticker = stickers[i];
        if (isInsideResizeControl(sticker, x, y)) {
            isResizing = true;
            selectedSticker = sticker;
            break;
        } else if (isInsideDeleteControl(sticker, x, y)) {
            stickers.splice(i, 1);
            updateCanvas();
            return;
        } else if (isInsideSticker(sticker, x, y)) {
            selectedSticker = sticker;
            dragOffsetX = x - sticker.x;
            dragOffsetY = y - sticker.y;
            isDragging = true;
            break;
        }
    }
    updateCanvas();
});

canvas.addEventListener('mousemove', function (e) {
    if (selectedSticker) {
        const { x, y } = getMousePos(e);

        if (isDragging) {
            selectedSticker.x = x - dragOffsetX;
            selectedSticker.y = y - dragOffsetY;
        } else if (isResizing) {
            selectedSticker.width = Math.max(10, x - selectedSticker.x);
            selectedSticker.height = Math.max(10, y - selectedSticker.y);
        }
        updateCanvas();
    }
});

canvas.addEventListener('mouseup', function () {
    isDragging = false;
    isResizing = false;
});


canvas.addEventListener('mousemove', function (e) {
    if (!isDragging || !isResizing || !selectedSticker) return;
    const { x, y } = getMousePos(e);

    if (isDragging) {
        selectedSticker.x = x - dragOffsetX;
        selectedSticker.y = y - dragOffsetY;
    } else if (isResizing) {
        selectedSticker.width = Math.max(10, x - selectedSticker.x);
        selectedSticker.height = Math.max(10, y - selectedSticker.y);
    }

    updateCanvas();
});

canvas.addEventListener('mouseup', function () {
    isDragging = false;
    isResizing = false;
});

// Function to add a sticker
document.querySelectorAll('.category img').forEach(img => {
    img.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', e.target.src);
    }, false);
});

canvas.addEventListener('drop', function (e) {
    e.preventDefault();
    const { x, y } = getMousePos(e);
    const imgSrc = e.dataTransfer.getData('text/plain');
    addSticker(imgSrc, x, y);
});

canvas.addEventListener('dragover', function (e) {
    e.preventDefault();
});

function addSticker(imgSrc, x, y) {
    const img = new Image();
    img.onload = function () {
        const stickerSize = 250;
        stickers.push({ img, x: x - stickerSize / 2, y: y - stickerSize / 2, width: stickerSize, height: stickerSize });
        updateCanvas();
    };
    img.src = imgSrc;
}

// Function to download the banner
document.getElementById('generateButton').addEventListener('click', function () {
    const link = document.createElement('a');
    link.download = 'twitter_banner.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Function to resize the canvas
function resizeCanvas() {
    const maxWidth = window.innerWidth - 20;
    const maxHeight = window.innerHeight * 0.8;
    const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
    canvas.style.width = (canvas.width * scale) + 'px';
    canvas.style.height = (canvas.height * scale) + 'px';
    updateCanvas();
}

// Initial resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);