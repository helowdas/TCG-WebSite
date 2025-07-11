const images = [
  "/sources/ODS/imagen1.jpg",
  "/sources/ODS/imagen2.jpg",
  "/sources/ODS/imagen3.jpg",
  "/sources/ODS/imagen4.jpg",
  "/sources/ODS/imagen5.jpg",
  "/sources/ODS/imagen6.jpg",
  "/sources/ODS/imagen7.jpg",
  "/sources/ODS/imagen8.jpg",
  "/sources/ODS/imagen9.jpg",
  "/sources/ODS/imagen10.jpg",
  "/sources/ODS/imagen11.jpg",
  "/sources/ODS/imagen12.jpg",
  "/sources/ODS/imagen13.jpg",
  "/sources/ODS/imagen14.jpg",
  "/sources/ODS/imagen15.jpg",
  "/sources/ODS/imagen16.jpg",
  "/sources/ODS/imagen17.png",
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