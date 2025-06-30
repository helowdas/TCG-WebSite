// Interactividad para cambiar imagen y texto en la sección Cómo Jugar
function setupHow2PlayInteraction() {
  // Delegación de eventos para asegurar que funcione tras cargar el DOM
  const list = document.getElementById("how2play-list");
  if (!list) return;
  list.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    list
      .querySelectorAll("button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("how2play-img").src =
      "/sources/imagenes_how2play/" + btn.getAttribute("data-img");
    document.getElementById("how2play-title").textContent =
      btn.getAttribute("data-title");
    document.getElementById("how2play-desc").textContent =
      btn.getAttribute("data-desc");
  });
}

document.addEventListener("DOMContentLoaded", setupHow2PlayInteraction);
