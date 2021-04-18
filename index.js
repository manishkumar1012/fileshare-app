const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseBtn = document.querySelector('#browseBtn');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    console.log('dragging');
    if (!dropZone.classList.contains('dragged')) {
        dropZone.classList.add('dragged');
    }
});

dropZone.addEventListener('dragleave', (e) => {
    dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged');

    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
    }
});

browseBtn.addEventListener('click', () => {
    fileInput.click();
});
