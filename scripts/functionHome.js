// Script para consumir la API de Pokémon TCG y mostrar cartas aleatorias en el banner
// Documentación de la API: https://docs.pokemontcg.io/

const API_URL = "https://api.pokemontcg.io/v2/cards?pageSize=10";

async function fetchRandomCards() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error al obtener cartas:", error);
    return [];
  }
}

// Al cargar la página, obtener cartas y actualizar el banner
window.addEventListener("DOMContentLoaded", async () => {
  const cards = await fetchRandomCards();
  if (cards.length > 0) {
    // Mezclar las cartas para mostrar aleatoriamente
    cards.sort(() => Math.random() - 0.5);
    // Si existe el hero-banner, usar el nuevo diseño
    if (document.getElementById("hero-banner")) {
      renderHeroBanner(cards);
    } else {
      updateCarousel(cards);
    }
  }
});

let jccCardsCache = [];
let jccCardInterval = null;

// API sencilla para guardar y leer cartas en IndexedDB
const JCC_DB_NAME = "jcc-cards-db";
const JCC_STORE_NAME = "cards";

function openJCCDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(JCC_DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(JCC_STORE_NAME)) {
        db.createObjectStore(JCC_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveCardsToDB(cards) {
  const db = await openJCCDB();
  const tx = db.transaction(JCC_STORE_NAME, "readwrite");
  const store = tx.objectStore(JCC_STORE_NAME);
  cards.forEach((card) => store.put(card));
  return tx.complete;
}

async function getCardsFromDB() {
  const db = await openJCCDB();
  return new Promise((resolve) => {
    const tx = db.transaction(JCC_STORE_NAME, "readonly");
    const store = tx.objectStore(JCC_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve([]);
  });
}

// Modifica fetchJCCCards para usar IndexedDB primero
async function fetchJCCCards() {
  if (jccCardsCache.length) return jccCardsCache;
  let cards = await getCardsFromDB();
  if (cards.length) {
    jccCardsCache = cards;
    return cards;
  }
  const API_URL = "https://api.pokemontcg.io/v2/cards?pageSize=50";
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    cards = data.data;
    jccCardsCache = cards;
    await saveCardsToDB(cards);
    return cards;
  } catch (e) {
    return [];
  }
}

async function showRandomJCCCard() {
  const cards = await fetchJCCCards();
  if (!cards.length) return;
  const card = cards[Math.floor(Math.random() * cards.length)];
  let cardDiv = document.getElementById("jcc-random-card");
  const carrusel = document.getElementById("carrusel");
  if (!carrusel) return;
  if (!cardDiv) {
    cardDiv = document.createElement("div");
    cardDiv.id = "jcc-random-card";
    carrusel.appendChild(cardDiv);
  }
  cardDiv.innerHTML = `<img src="${card.images.large}" alt="${card.name}" class="jcc-random-img"/>`;
}

window.addEventListener("DOMContentLoaded", async () => {
  await showRandomJCCCard();
  if (jccCardInterval) clearInterval(jccCardInterval);
  jccCardInterval = setInterval(showRandomJCCCard, 3500); // Cambia cada 3.5 segundos
});
