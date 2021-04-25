const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseBtn = document.querySelector('#browseBtn');
const bgProgress = document.querySelector('.bg-progress');
const percentDiv = document.querySelector('#percent');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const fileURLInput = document.querySelector('#fileURL');
const sharingContainer = document.querySelector('.sharing-container');
const copyBtn = document.querySelector('#copyBtn');
const emailForm = document.querySelector("#emailForm");

// const host = 'https://fileshare-api-by-manish.herokuapp.com';
const host = 'http://localhost:3000';
const fileUploadUrl = `${host}/api/files`;

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
        uploadFile();
    }
});

browseBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    uploadFile();
});

copyBtn.addEventListener('click', () => {
    fileURLInput.select();
    document.execCommand('copy');
})

const uploadFile = () => {
    progressContainer.style.display = 'block';
    // get the file from fileInput
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('myfile', file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    }

    xhr.upload.onprogress = updateProgress;

    xhr.open('POST', fileUploadUrl);
    xhr.send(formData);
}

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`;
}

const showLink = ({ file: url }) => {
    console.log(url);
    progressContainer.style.display = 'none';
    sharingContainer.style.display = 'block';
    fileURLInput.value = url;
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const url = fileURLInput.value;
  
    const formData = {
      uuid: url.split("/").splice(-1, 1)[0],
      emailTo: emailForm.elements["to-email"].value,
      emailFrom: emailForm.elements["from-email"].value,
    };
    
    console.log(formData);
  });