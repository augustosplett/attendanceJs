// Access the necessary HTML elements
const modal = document.getElementById('myModal');
const closeButton = document.getElementsByClassName('close')[0];
const video = document.getElementById('video');
const captureButton = document.getElementById('captureButton');
const saveButton = document.getElementById('saveButton');
const restartButton = document.getElementById('restartButton');
const photoGallery = document.getElementById('photoGallery');
const idModal = document.getElementById('hidden-student-id');
// Variables to store captured photos
let capturedPhotos = [];


function clearPhotoGalery(){
    while (photoGallery.firstChild) {
        photoGallery.removeChild(photoGallery.firstChild);
    }
}

restartButton.addEventListener('click', clearPhotoGalery)

closeButton.addEventListener('click', closeModal);

function closeModal() {
    modal.style.display = 'none';
    video.srcObject.getTracks().forEach(function(track) {
        track.stop();
    });
    clearPhotoGalery();
}

function activateCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        video.srcObject = stream;
      })
      .catch(function(error) {
        console.error('Error accessing webcam:', error);
      });
}

captureButton.addEventListener('click', captureImages );

async function captureImages() {

    const numPhotos = 5; // Number of photos to capture
    user = idModal.innerText
    for (let i = 0; i < numPhotos; i++) {
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
            // Convert the canvas content to a Blob object
            canvas.toBlob((blob) => {
            const formData = new FormData();
            formData.append('imagem', blob, `${i}.png`);
            sendFormData(formData, user)

            const photoElement = document.createElement('img');
            photoElement.src = URL.createObjectURL(blob);
            photoElement.style.width = '20%';
            photoElement.style.boxSizing = 'border-box';
            photoGallery.appendChild(photoElement);
 
            }, 'image/png');
        }, i * 1000); // Delay each capture by 1 second (adjust as needed)
    }
}

async function sendFormData(form, user) {

    // Send the FormData object to the API using fetch or any other method
    await fetch(`http://127.0.0.1:3000/photos/${user}`, {
    method: 'POST',
    body: form,
    mode: 'no-cors'
    })
    .then(response => {
    // Handle the API response
    console.log('Images uploaded successfully');
    })
    .catch(error => {
    // Handle any errors
    console.error('Error uploading images:', error);
    });
}

