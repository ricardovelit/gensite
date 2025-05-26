"""
Módulo para generar y manejar design tokens

Funcionalidades:
- Genera CSS Custom Properties para colores y tipografías
- Soporta preprocesadores mediante plugins
"""
from typing import Dict, List

class DesignTokens:
    """
    Clase para generar y manejar design tokens
    """
    
    def __init__(self):
        self.tokens = {
            'colors': {},
            'typography': {}
        }
    
    def agregar_color(self, nombre: str, valor: str) -> None:
        """Agrega un nuevo token de color"""
        self.tokens['colors'][nombre] = valor
    
    def agregar_tipografia(self, nombre: str, propiedades: Dict[str, str]) -> None:
        """Agrega un nuevo token de tipografía"""
        self.tokens['typography'][nombre] = propiedades
    
    def generar_css(self) -> str:
        """Genera CSS Custom Properties a partir de los tokens"""
        css = ":root {\n"
        
        # Generar tokens de color
        for nombre, valor in self.tokens['colors'].items():
            css += f"  --color-{nombre}: {valor};\n"
        
        # Generar tokens de tipografía
        for nombre, props in self.tokens['typography'].items():
            for prop, valor in props.items():
                css += f"  --font-{nombre}-{prop}: {valor};\n"
        
        css += "}"
        return css
    
    def generar_sass(self) -> str:
        """Genera variables Sass/Less a partir de los tokens"""
        sass = ""
        
        # Generar tokens de color
        for nombre, valor in self.tokens['colors'].items():
            sass += f"$color-{nombre}: {valor};\n"
        
        # Generar tokens de tipografía
        for nombre, props in self.tokens['typography'].items():
            for prop, valor in props.items():
                sass += f"$font-{nombre}-{prop}: {valor};\n"
        
        return sass