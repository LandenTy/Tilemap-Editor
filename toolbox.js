let selectedTile = null;

function isCellEmpty(ctx, x, y, width, height) {
    const imageData = ctx.getImageData(x, y, width, height).data;
    for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] !== 0) {
            return false; // Cell is not completely transparent
        }
    }
    return true; // Cell is completely transparent
}

function darkenTile(tile) {
    tile.style.filter = 'brightness(50%)';
}

function resetTile(tile) {
    tile.style.filter = 'brightness(100%)';
}

function cutImage() {
    const fileInput = document.getElementById('fileInput');
    const tileWidth = parseInt(document.getElementById('tileWidth').value);
    const tileHeight = parseInt(document.getElementById('tileHeight').value);

    if (!fileInput.files.length) {
        alert('Please choose an image.');
        return;
    }

    const imageFile = fileInput.files[0];
    const img = new Image();

    img.onload = function() {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';

        const menuDiv = document.getElementById('menu');
        menuDiv.innerHTML = '';

        const rows = Math.ceil(img.height / tileHeight);
        const cols = Math.ceil(img.width / tileWidth);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const canvas = document.createElement('canvas');
                canvas.width = tileWidth;
                canvas.height = tileHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(
                    img,
                    col * tileWidth,
                    row * tileHeight,
                    tileWidth,
                    tileHeight,
                    0,
                    0,
                    tileWidth,
                    tileHeight
                );

                if (!isCellEmpty(ctx, 0, 0, tileWidth, tileHeight)) {
                    const tileDiv = document.createElement('div');
                    tileDiv.classList.add('menu-tile');
                    tileDiv.style.backgroundImage = `url(${canvas.toDataURL()})`;

                    tileDiv.addEventListener('click', function() {
                        if (selectedTile) {
                            resetTile(selectedTile);
                        }
                        selectedTile = this;
                        darkenTile(this);
                    });

                    menuDiv.appendChild(tileDiv);
                }
            }
        }
    };

    img.src = URL.createObjectURL(imageFile);
}