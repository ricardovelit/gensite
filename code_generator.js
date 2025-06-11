// Módulo para generar código en vivo
class CodeGenerator {
  constructor() {
    this.codeDisplay = document.querySelector('.live-code');
    this.descriptionInput = document.querySelector('.description-input');
    this.codeLines = [];
    this.currentLine = 0;
    this.typingSpeed = 50;
    this.highlightDelay = 100;
  }

  // Inicializar el generador de código
  init() {
    this.descriptionInput.addEventListener('input', () => {
      this.generateCodeFromDescription(this.descriptionInput.value);
    });
    
    this.descriptionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        document.querySelector('.code-panel').scrollIntoView({ behavior: 'smooth' });
        this.generateCodeFromDescription(this.descriptionInput.value);
      }
    });
  }

  // Generar código basado en la descripción
  generateCodeFromDescription(description) {
    if (!description) return;
    
    // Limpiar el código anterior
    this.codeDisplay.innerHTML = '';
    this.codeLines = [];
    this.currentLine = 0;
    
    // Simular generación de código (esto sería reemplazado por la IA real)
    this.codeLines.push('<!DOCTYPE html>');
    this.codeLines.push('<html lang="es">');
    this.codeLines.push('  <head>');
    this.codeLines.push('    <meta charset="UTF-8">');
    this.codeLines.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    this.codeLines.push(`    <title>${description.substring(0, 20)}</title>`);
    this.codeLines.push('    <link rel="stylesheet" href="styles.css">');
    this.codeLines.push('  </head>');
    this.codeLines.push('  <body>');
    this.codeLines.push('    <div class="container">');
    this.codeLines.push('      <h1>Tu sitio web</h1>');
    this.codeLines.push(`      <p>${description}</p>`);
    this.codeLines.push('    </div>');
    this.codeLines.push('  </body>');
    this.codeLines.push('</html>');
    
    // Mostrar el código línea por línea
    this.typeNextLine();
  }

  // Mostrar la siguiente línea de código
  typeNextLine() {
    if (this.currentLine >= this.codeLines.length) return;
    
    const line = this.codeLines[this.currentLine];
    const lineElement = document.createElement('div');
    this.codeDisplay.appendChild(lineElement);
    
    this.typeCode(lineElement, line, () => {
      hljs.highlightElement(lineElement);
      this.currentLine++;
      setTimeout(() => this.typeNextLine(), this.highlightDelay);
    });
  }

  // Efecto de escritura
  typeCode(element, text, callback) {
    let i = 0;
    
    function typing() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typing, this.typingSpeed);
      } else if (callback) {
        callback();
      }
    }
    
    typing = typing.bind(this);
    typing();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const codeGenerator = new CodeGenerator();
  codeGenerator.init();
});