const images = [
  'imagen1.jpg',
  'imagen2.jpg',
  'imagen3.jpg',
  'imagen4.jpg',
  'imagen5.jpg',
  'imagen6.jpg',
  'imagen7.jpg',
  'imagen8.jpg',
  'imagen9.jpg',
  'imagen10.jpg',
  'imagen11.jpg',
  'imagen12.jpg',
  'imagen13.jpg',
  'imagen14.jpg',
  'imagen15.jpg',
  'imagen16.jpg',
  'imagen17.png',
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