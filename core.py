"""
Módulo core del sistema GENSITE

Contiene la lógica principal para:
- Generación de código
- Procesamiento de plantillas
- Conversión de acciones NO-CODE a código real
- Conexión con backend Supabase
"""

from supabase_handler import SupabaseHandler

class ProjectTemplate:
    """Clase base para plantillas de proyectos"""
    
    def __init__(self, name: str, description: str, components: List[str]):
        self.name = name
        self.description = description
        self.components = components
    
    def validate(self) -> bool:
        """Valida si la plantilla está correctamente configurada"""
        return bool(self.name and self.components)


class GeneradorCodigo:
    """Clase principal para la generación de código"""
    
    def __init__(self):
        """Inicializa el generador con configuraciones básicas"""
        self.plantillas = {}
        self.project_templates = self._load_default_templates()
        self.supabase = SupabaseHandler()
        self.intenciones = {
            'generar': ['crear', 'hacer', 'generar', 'construir'],
            'modificar': ['cambiar', 'editar', 'ajustar', 'modificar'],
            'consultar': ['preguntar', 'consultar', 'saber', 'información']
        }
        self.respuestas = {
            'saludo': '¡Hola! Soy tu asistente para generación de código. ¿En qué puedo ayudarte hoy?',
            'despedida': '¡Gracias por usar GENSITE! Vuelve cuando necesites más ayuda.',
            'error': 'No entendí tu solicitud. ¿Podrías reformularla?'
        }
        
    def _load_default_templates(self) -> Dict[str, ProjectTemplate]:
        """Carga las plantillas predefinidas para tipos de proyectos"""
        return {
            "landing": ProjectTemplate(
                "Landing Page",
                "Plantilla para páginas de aterrizaje con componentes esenciales",
                ["header", "hero", "features", "testimonials", "cta", "footer"]
            ),
            "multipage": ProjectTemplate(
                "Sitio Web Multi-página",
                "Plantilla para sitios con múltiples páginas y navegación",
                ["header", "navigation", "content_sections", "footer"]
            ),
            "ecommerce": ProjectTemplate(
                "E-commerce",
                "Plantilla para tiendas online con pasarelas de pago",
                ["header", "product_grid", "cart", "checkout", "payment_gateways", "footer"]
            )
        }
        
    def cargar_plantilla(self, nombre, contenido):
        """Carga una nueva plantilla para generación de código"""
        self.plantillas[nombre] = contenido
        
    def generar_codigo(self, nombre_plantilla, parametros):
        """
        Genera código basado en una plantilla y parámetros
        
        Args:
            nombre_plantilla (str): Nombre de la plantilla a usar
            parametros (dict): Diccionario con parámetros para la plantilla
            
        Returns:
            str: Código generado
        """
        if nombre_plantilla not in self.plantillas:
            raise ValueError(f"Plantilla '{nombre_plantilla}' no encontrada")
            
        return self.plantillas[nombre_plantilla].format(**parametros)
        
    def procesar_entrada(self, texto):
        """
        Procesa el texto del usuario para determinar su intención
        
        Args:
            texto (str): Entrada del usuario
            
        Returns:
            str: Respuesta generada
        """
        texto = texto.lower()
        
        # Detección de saludos/despedidas
        if any(palabra in texto for palabra in ['hola', 'hi', 'buenos']):
            return self.respuestas['saludo']
        if any(palabra in texto for palabra in ['adiós', 'chao', 'gracias']):
            return self.respuestas['despedida']
            
        # Detección de intenciones
        for intencion, palabras in self.intenciones.items():
            if any(palabra in texto for palabra in palabras):
                return f"Entendí que quieres {intencion} algo. Por favor proporcióname más detalles."
                
        return self.respuestas['error']
        
    def convertir_accion(self, accion_no_code):
        """
        Convierte una acción NO-CODE a código real
        
        Args:
            accion_no_code (dict): Acción en formato NO-CODE
            
        Returns:
            str: Código equivalente
        """
        # Lógica de conversión aquí
        pass
        
    def iniciar_conversacion(self):
        """Inicia una conversación interactiva con el usuario"""
        print(self.respuestas['saludo'])
        
        while True:
            entrada = input("Usuario: ").strip()
            if not entrada:
                continue
                
            respuesta = self.procesar_entrada(entrada)
            print(f"Asistente: {respuesta}")
            
            if any(palabra in entrada.lower() for palabra in ['adiós', 'chao', 'gracias']):
                break
                
    def generar_desde_conversacion(self):
        """
        Genera código basado en una conversación con el usuario
        
        Returns:
            str: Código generado
        """
        self.iniciar_conversacion()
        return "# Código generado desde la conversación"