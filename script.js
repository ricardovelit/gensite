// Configuración de partículas flotantes
const particlesConfig = {
  density: 100,
  colors: ['#00f3ff', '#ff00ff', '#00ff88', '#ff6b35'],
  symbols: ['<', '>', '{', '}', '(', ')', 'function', '=>', 'const', 'let', 'return']
};

// Inicializar partículas
function initParticles() {
  const particlesContainer = document.querySelector('.particles');
  
  for (let i = 0; i < particlesConfig.density; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Configuración aleatoria
    const size = Math.random() * 20 + 5;
    const color = particlesConfig.colors[Math.floor(Math.random() * particlesConfig.colors.length)];
    const symbol = particlesConfig.symbols[Math.floor(Math.random() * particlesConfig.symbols.length)];
    
    particle.textContent = symbol;
    particle.style.color = color;
    particle.style.fontSize = `${size}px`;
    particle.style.position = 'absolute';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    
    // Animación
    const duration = Math.random() * 20 + 10;
    particle.style.animation = `float ${duration}s linear infinite`;
    
    particlesContainer.appendChild(particle);
  }
}

// Efecto de código que se escribe
function typeCode(element, code, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function typing() {
    if (i < code.length) {
      element.textContent += code.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  
  typing();
}

// Inicializar efectos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  
  // Ejemplo de código que se escribe
  const codeElement = document.querySelector('.code-typing');
  if (codeElement) {
    const exampleCode = `function generateSite(description) {
  // Analizar la descripción
  const components = parseDescription(description);
  
  // Generar estructura HTML
  const html = generateHTML(components);
  
  // Optimizar CSS
  const css = optimizeCSS(html);
  
  // Devolver proyecto completo
  return { html, css, js: generateJS(html) };
}`;
    
    typeCode(codeElement, exampleCode);
  }
});

// Animaciones CSS para las partículas
const style = document.createElement('style');
style.textContent = `
@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}
`;
document.head.appendChild(style);