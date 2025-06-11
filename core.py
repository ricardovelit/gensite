<<<<<<< HEAD
"""
Módulo core del sistema GENSITE

Contiene la lógica principal para:
- Generación de código
- Procesamiento de plantillas
- Conversión de acciones NO-CODE a código real
- Conexión con backend Supabase
"""

from supabase_handler import SupabaseHandler
from fastapi import FastAPI, WebSocket
from typing import Dict, List, Optional, Any
import asyncio
from enum import Enum
import json

class CodeGenerationEvent(str, Enum):
    THINKING = "thinking"
    WRITING = "writing"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    ERROR = "error"

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

class CodeGenerationManager:
    def __init__(self):
        self.active_sessions: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = []
        self.active_sessions[session_id].append(websocket)
        
    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_sessions:
            if websocket in self.active_sessions[session_id]:
                self.active_sessions[session_id].remove(websocket)
            if not self.active_sessions[session_id]:
                del self.active_sessions[session_id]
                
    async def broadcast_event(self, session_id: str, event_type: CodeGenerationEvent, data: Any):
        if session_id in self.active_sessions:
            message = {
                "type": event_type,
                "data": data,
                "timestamp": asyncio.get_event_loop().time()
            }
            for connection in self.active_sessions[session_id]:
                try:
                    await connection.send_json(message)
                except:
                    await self.disconnect(connection, session_id)

class CodeGenerator:
    def __init__(self, events_manager: CodeGenerationManager):
        self.events_manager = events_manager
        
    async def generate_code_with_streaming(self, session_id: str, prompt: str) -> str:
        """
        Genera código basado en el prompt del usuario, transmitiendo el proceso en tiempo real
        """
        try:
            # Simular el proceso de pensamiento
            await self.events_manager.broadcast_event(
                session_id,
                CodeGenerationEvent.THINKING,
                {"message": "Analizando tu solicitud..."}
            )
            await asyncio.sleep(1)  # Simular tiempo de procesamiento
            
            # Simular el proceso de escritura
            await self.events_manager.broadcast_event(
                session_id,
                CodeGenerationEvent.WRITING,
                {"message": "Generando código..."}
            )
            
            # Aquí iría la lógica real de generación de código
            # Por ahora solo es un placeholder
            generated_code = "// Código generado\n"
            
            # Simular el análisis final
            await self.events_manager.broadcast_event(
                session_id,
                CodeGenerationEvent.ANALYZING,
                {"message": "Verificando el código generado..."}
            )
            
            # Enviar el código completado
            await self.events_manager.broadcast_event(
                session_id,
                CodeGenerationEvent.COMPLETED,
                {"code": generated_code}
            )
            
            return generated_code
            
        except Exception as e:
            await self.events_manager.broadcast_event(
                session_id,
                CodeGenerationEvent.ERROR,
                {"error": str(e)}
            )
            raise

# Configuración de la aplicación FastAPI
app = FastAPI()
code_gen_manager = CodeGenerationManager()
code_generator = CodeGenerator(code_gen_manager)

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await code_gen_manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            request = json.loads(data)
            if request.get("type") == "generate":
                await code_generator.generate_code_with_streaming(
                    session_id,
                    request.get("prompt", "")
                )
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        code_gen_manager.disconnect(websocket, session_id)
=======
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
>>>>>>> 90d22681d2c30acb385206e300b3ba63575d2b65
