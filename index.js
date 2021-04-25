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
const emailForm = document.querySelector('#emailForm');

// const host = 'https://fileshare-api-by-manish.herokuapp.com';
const host = 'http://localhost:3000';
const fileUploadUrl = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb

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
});

const uploadFile = () => {
    progressContainer.style.display = 'block';
    // get the file from fileInput
    const file = fileInput.files[0];

    if (file.size > maxAllowedSize) {
        console.log("Can't upload more than 100mb");
        fileInput.value = '';
        return;
    }

    const formData = new FormData();
    formData.append('myfile', file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);
            onFileUploadSuccess(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open('POST', fileUploadUrl);
    xhr.send(formData);
};

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`;
};

const onFileUploadSuccess = ({ file: url }) => {
    console.log(url);

    fileInput.value = '';

    // remove the disabled attribute from form btn
    emailForm[2].removeAttribute('disabled');
    emailForm[2].innerText = 'Send';

    progressContainer.style.display = 'none';
    sharingContainer.style.display = 'block';
    fileURLInput.value = url;
};

emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // disable the button
    emailForm[2].setAttribute('disabled', 'true');
    emailForm[2].innerText = 'Sending';

    const url = fileURLInput.value;

    const formData = {
        uuid: url.split('/').splice(-1, 1)[0],
        emailTo: emailForm.elements['to-email'].value,
        emailFrom: emailForm.elements['from-email'].value,
    };

    console.log(formData);

    fetch(emailURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                sharingContainer.style.display = 'none'; 
            }
        });
});
