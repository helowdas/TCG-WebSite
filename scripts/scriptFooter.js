const images = [
  "/sources/ODS/img1.png",
  "/sources/ODS/img2.png",
  "/sources/ODS/img3.png",
  "/sources/ODS/img4.png",
  "/sources/ODS/img5.png",
  "/sources/ODS/img6.png",
  "/sources/ODS/img7.png",
  "/sources/ODS/img8.png",
  "/sources/ODS/img9.png",
  "/sources/ODS/img10.png",
  "/sources/ODS/img11.png",
  "/sources/ODS/img12.png",
  "/sources/ODS/img13.png",
  "/sources/ODS/img14.png",
  "/sources/ODS/img15.png",
  "/sources/ODS/img16.png",
  "/sources/ODS/img17.png",
];

let index = 0;
const odsImage = document.getElementById('ods-image');

function showImage(i) {
  odsImage.src = images[i];
}

function nextImage() {
  index = (index + 1) % images.length;
  showImage(index);
}

function prevImage() {
  index = (index - 1 + images.length) % images.length;
  showImage(index);
}

// Opcional: cambio automático cada 5 segundos
setInterval(() => {
  nextImage();
}, 5000);