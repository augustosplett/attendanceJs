const video = document.getElementById("video");
const videoContainer = document.getElementById("video-container");
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("../models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}
//aqui é onde está buscando as imagens no banco de imagem
function getLabeledFaceDescriptions() {
  //aqui está hardcode o nome das pastas, depois tem que fazer ficar dinâmico
  const labels = ["augusto", "Priscilla"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      //posso trocar esse fo, que está lendo só duas imagens por um que leia todas dentro da pasta
      for (let i = 1; i <= 2; i++) {
        //lembrar de ajustar o path aqui
        const img = await faceapi.fetchImage(`../labels/${label}/${i}.jpg`);       
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

video.addEventListener("play", async () => {
  //carrega todas as imagens para que seja possível identificar as pessoas
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  
  const canvas = faceapi.createCanvasFromMedia(video);
  myCanva=videoContainer.appendChild(canvas);
  myCanva.style.position = "absolute";
  myCanva.style.top = "0px";
  myCanva.style.left = "0px";
  myCanva.style.boxSizing = "border-box";
  //document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      drawBox.draw(canvas);
      //consigo pegar o nome da pessoa que foi identificada assim
      console.log(results[0].label);
    });
  }, 100);
});
