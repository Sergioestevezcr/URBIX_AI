/* ═══════════════════════════════════════════════
   URBIX AI — Script principal
   ═══════════════════════════════════════════════ */

// Barra de navegación: efecto al desplazarse y sección activa.
const barraNav = document.getElementById('barra-navegacion');
const enlacesNav = document.querySelectorAll('.enlace-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    barraNav.classList.add('scrolled');
  } else {
    barraNav.classList.remove('scrolled');
  }
  actualizarEnlaceNavActivo();
  actualizarSubnavegacion();
});

function actualizarEnlaceNavActivo() {
  const secciones = ['empresa', 'proyecto', 'inversionistas'];
  let seccionActual = '';
  secciones.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento && window.scrollY >= elemento.offsetTop - 120) {
      seccionActual = id;
    }
  });

  enlacesNav.forEach((enlace) => {
    enlace.classList.remove('active');
    if (enlace.dataset.section === seccionActual) {
      enlace.classList.add('active');
    }
  });
}

// Subnavegación: resaltar enlace visible en pantalla.
function actualizarSubnavegacion() {
  const enlacesSubnavegacion = document.querySelectorAll('.enlace-subnavegacion');
  enlacesSubnavegacion.forEach((enlace) => {
    const destinoId = enlace.getAttribute('href').replace('#', '');
    const destino = document.getElementById(destinoId);
    if (!destino) return;

    const rect = destino.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom > 140) {
      enlacesSubnavegacion.forEach((item) => item.classList.remove('active'));
      enlace.classList.add('active');
    }
  });
}

// Menú móvil.
const botonMenuMovil = document.getElementById('menu-movil');
const contenedorEnlacesNav = document.getElementById('enlaces-nav');

if (botonMenuMovil && contenedorEnlacesNav) {
  botonMenuMovil.addEventListener('click', () => {
    botonMenuMovil.classList.toggle('open');
    contenedorEnlacesNav.classList.toggle('open');
  });

  contenedorEnlacesNav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      botonMenuMovil.classList.remove('open');
      contenedorEnlacesNav.classList.remove('open');
    });
  });
}

// Desplazamiento suave para enlaces ancla.
document.querySelectorAll('a[href^="#"]').forEach((ancla) => {
  ancla.addEventListener('click', function (evento) {
    const destino = document.querySelector(this.getAttribute('href'));
    if (!destino) return;

    evento.preventDefault();
    const alturaNav = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
    const desplazamiento = destino.getBoundingClientRect().top + window.scrollY - alturaNav - 8;
    window.scrollTo({ top: desplazamiento, behavior: 'smooth' });
  });
});

// Animaciones de aparición.
const elementosAparecen = document.querySelectorAll(
  '.tarjeta-problema, .tarjeta-arquitectura, .tarjeta-equipo, .tarjeta-disciplina, .celda-canvas, .tarjeta-info, .item-funcionalidad'
);

elementosAparecen.forEach((elemento) => elemento.classList.add('aparecer'));

const observadorAparicion = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      const indice = Array.from(entrada.target.parentElement?.children || []).indexOf(entrada.target);
      const retardo = indice * 60;
      setTimeout(() => {
        entrada.target.classList.add('visible');
      }, Math.min(retardo, 400));
      observadorAparicion.unobserve(entrada.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

elementosAparecen.forEach((elemento) => observadorAparicion.observe(elemento));

// Animación de contadores en cifras de portada.
function animarContador(elemento, meta, sufijo = '', duracion = 1500) {
  const esDecimal = meta % 1 !== 0;
  const inicio = performance.now();

  function actualizar(ahora) {
    const transcurrido = ahora - inicio;
    const progreso = Math.min(transcurrido / duracion, 1);
    const suavizado = 1 - Math.pow(1 - progreso, 3);
    const valor = esDecimal ? (suavizado * meta).toFixed(1) : Math.round(suavizado * meta);
    elemento.textContent = valor + sufijo;
    if (progreso < 1) requestAnimationFrame(actualizar);
  }

  requestAnimationFrame(actualizar);
}

const cifrasPortada = document.querySelectorAll('.dato-portada-num');
const observadorCifras = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      const elemento = entrada.target;
      const texto = elemento.textContent;
      if (texto.includes('#')) animarContador(elemento, 7, '#', 800);
      if (texto.includes('h')) animarContador(elemento, 153, 'h', 1200);
      if (texto.includes('M')) animarContador(elemento, 600, 'M', 1000);
      if (texto.includes('.')) animarContador(elemento, 18.9, '', 1000);
      observadorCifras.unobserve(elemento);
    });
  },
  { threshold: 0.5 }
);

cifrasPortada.forEach((elemento) => observadorCifras.observe(elemento));

// Video: ocultar capa cuando exista iframe o animar botón en placeholder.
const botonReproducir = document.getElementById('boton-reproducir');
const marcoVideo = document.getElementById('marco-video');

if (botonReproducir && marcoVideo) {
  botonReproducir.addEventListener('click', () => {
    const iframe = marcoVideo.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      if (!src.includes('autoplay=1')) {
        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
      }
      marcoVideo.querySelector('.capa-video').style.display = 'none';
      return;
    }

    botonReproducir.style.transform = 'scale(0.9)';
    setTimeout(() => {
      botonReproducir.style.transform = '';
    }, 150);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  actualizarEnlaceNavActivo();
  actualizarSubnavegacion();
});

// Evitar que la subnavegación cubra el contenido al navegar por anclas.
document.querySelectorAll('.enlace-subnavegacion').forEach((enlace) => {
  enlace.addEventListener('click', function (evento) {
    const destino = document.querySelector(this.getAttribute('href'));
    if (!destino) return;

    evento.preventDefault();
    const desplazamientoTotal = 68 + 52 + 8;
    const posicion = destino.getBoundingClientRect().top + window.scrollY - desplazamientoTotal;
    window.scrollTo({ top: posicion, behavior: 'smooth' });
  });
});



