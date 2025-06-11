<<<<<<< HEAD
"""
Módulo para componentes UI de arrastrar/soltar en GENSITE

Funcionalidades:
- Componentes predefinidos para páginas web
- Sistema de arrastrar y soltar
- Generación de código limpio
"""
from typing import List, Dict
import json

class UIComponent:
    """Clase base para componentes UI"""
    
    def __init__(self, name: str, category: str, default_props: Dict):
        self.name = name
        self.category = category
        self.props = default_props
        self.project_types = []  # Tipos de proyectos compatibles
    
    def generate_html(self) -> str:
        """Genera el código HTML del componente"""
        raise NotImplementedError
        
    def add_project_type(self, project_type: str) -> None:
        """Añade un tipo de proyecto compatible con este componente"""
        if project_type not in self.project_types:
            self.project_types.append(project_type)
            
    def is_compatible_with(self, project_type: str) -> bool:
        """Verifica si el componente es compatible con un tipo de proyecto"""
        return project_type in self.project_types


class PageBuilder:
    """Constructor de páginas con sistema de arrastrar/soltar"""
    
    def __init__(self):
        self.components: List[UIComponent] = []
        self.available_components = self._load_default_components()
    
    def _load_default_components(self) -> Dict[str, UIComponent]:
        """Carga componentes predefinidos"""
        return {
            "header": UIComponent("Header", "layout", {"title": "Mi Sitio"}),
            "hero": UIComponent("Hero", "layout", {"title": "Bienvenido", "subtitle": "Crea tu sitio web"}),
            "footer": UIComponent("Footer", "layout", {"copyright": "© 2024"})
        }
    
    def add_component(self, component_name: str, props: Dict = None) -> None:
        """Añade un componente a la página"""
        if component_name in self.available_components:
            component = self.available_components[component_name]
            if props:
                component.props.update(props)
            self.components.append(component)
    
    def generate_page(self) -> str:
        """Genera el código HTML completo de la página"""
        html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Mi Sitio</title></head><body>"
        
        for component in self.components:
            html += component.generate_html()
            
        html += "</body></html>"
        return html
        
    def generate_live_code(self) -> str:
        """Genera el código HTML mostrando el proceso en vivo"""
        live_code = "Generando código:\n\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset='UTF-8'>\n  <title>Mi Sitio</title>\n</head>\n<body>\n"
        
        for component in self.components:
            live_code += f"  <!-- {component.name} -->\n"
            live_code += f"  {component.generate_html().replace('<', '\n    <')}\n\n"
            
        live_code += "</body>\n</html>"
        return live_code
    
    def save_layout(self, file_path: str) -> None:
        """Guarda el layout actual como JSON"""
        layout = {
            "components": [
                {"name": c.name, "category": c.category, "props": c.props}
                for c in self.components
            ]
        }
        
        with open(file_path, 'w') as f:
            json.dump(layout, f, indent=2)
            
    def purchase_plan(self, plan_type: str) -> Dict:
        """Maneja la compra de planes"""
        plans = {
            "basic": {"price": 9.99, "features": ["1 sitio", "1GB almacenamiento"]},
            "pro": {"price": 19.99, "features": ["3 sitios", "5GB almacenamiento", "SSL"]},
            "business": {"price": 49.99, "features": ["10 sitios", "20GB almacenamiento", "SSL", "Soporte"]}
        }
        return plans.get(plan_type, {})
        
    def connect_domain(self, domain: str) -> bool:
        """Conecta un dominio al sitio"""
        # Lógica para verificar y conectar dominio
        return True if domain else False
        
    def connect_supabase(self, config: Dict) -> bool:
        """Conecta con Supabase para despliegue"""
        # Lógica para conexión con Supabase
        return True if config else False
        
    def connect_payment_gateway(self, gateway_name: str, config: Dict) -> bool:
        """Conecta con una pasarela de pagos específica"""
        supported_gateways = {
            "stripe": {"required": ["api_key", "webhook_secret"]},
            "paypal": {"required": ["client_id", "secret"]},
            "mercadopago": {"required": ["access_token"]}
        }
        
        if gateway_name not in supported_gateways:
            return False
            
        required_fields = supported_gateways[gateway_name]["required"]
=======
"""
Módulo para componentes UI de arrastrar/soltar en GENSITE

Funcionalidades:
- Componentes predefinidos para páginas web
- Sistema de arrastrar y soltar
- Generación de código limpio
"""
from typing import List, Dict
import json

class UIComponent:
    """Clase base para componentes UI"""
    
    def __init__(self, name: str, category: str, default_props: Dict):
        self.name = name
        self.category = category
        self.props = default_props
        self.project_types = []  # Tipos de proyectos compatibles
    
    def generate_html(self) -> str:
        """Genera el código HTML del componente"""
        raise NotImplementedError
        
    def add_project_type(self, project_type: str) -> None:
        """Añade un tipo de proyecto compatible con este componente"""
        if project_type not in self.project_types:
            self.project_types.append(project_type)
            
    def is_compatible_with(self, project_type: str) -> bool:
        """Verifica si el componente es compatible con un tipo de proyecto"""
        return project_type in self.project_types


class PageBuilder:
    """Constructor de páginas con sistema de arrastrar/soltar"""
    
    def __init__(self):
        self.components: List[UIComponent] = []
        self.available_components = self._load_default_components()
    
    def _load_default_components(self) -> Dict[str, UIComponent]:
        """Carga componentes predefinidos"""
        return {
            "header": UIComponent("Header", "layout", {"title": "Mi Sitio"}),
            "hero": UIComponent("Hero", "layout", {"title": "Bienvenido", "subtitle": "Crea tu sitio web"}),
            "footer": UIComponent("Footer", "layout", {"copyright": "© 2024"})
        }
    
    def add_component(self, component_name: str, props: Dict = None) -> None:
        """Añade un componente a la página"""
        if component_name in self.available_components:
            component = self.available_components[component_name]
            if props:
                component.props.update(props)
            self.components.append(component)
    
    def generate_page(self) -> str:
        """Genera el código HTML completo de la página"""
        html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Mi Sitio</title></head><body>"
        
        for component in self.components:
            html += component.generate_html()
            
        html += "</body></html>"
        return html
        
    def generate_live_code(self) -> str:
        """Genera el código HTML mostrando el proceso en vivo"""
        live_code = "Generando código:\n\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset='UTF-8'>\n  <title>Mi Sitio</title>\n</head>\n<body>\n"
        
        for component in self.components:
            live_code += f"  <!-- {component.name} -->\n"
            live_code += f"  {component.generate_html().replace('<', '\n    <')}\n\n"
            
        live_code += "</body>\n</html>"
        return live_code
    
    def save_layout(self, file_path: str) -> None:
        """Guarda el layout actual como JSON"""
        layout = {
            "components": [
                {"name": c.name, "category": c.category, "props": c.props}
                for c in self.components
            ]
        }
        
        with open(file_path, 'w') as f:
            json.dump(layout, f, indent=2)
            
    def purchase_plan(self, plan_type: str) -> Dict:
        """Maneja la compra de planes"""
        plans = {
            "basic": {"price": 9.99, "features": ["1 sitio", "1GB almacenamiento"]},
            "pro": {"price": 19.99, "features": ["3 sitios", "5GB almacenamiento", "SSL"]},
            "business": {"price": 49.99, "features": ["10 sitios", "20GB almacenamiento", "SSL", "Soporte"]}
        }
        return plans.get(plan_type, {})
        
    def connect_domain(self, domain: str) -> bool:
        """Conecta un dominio al sitio"""
        # Lógica para verificar y conectar dominio
        return True if domain else False
        
    def connect_supabase(self, config: Dict) -> bool:
        """Conecta con Supabase para despliegue"""
        # Lógica para conexión con Supabase
        return True if config else False
        
    def connect_payment_gateway(self, gateway_name: str, config: Dict) -> bool:
        """Conecta con una pasarela de pagos específica"""
        supported_gateways = {
            "stripe": {"required": ["api_key", "webhook_secret"]},
            "paypal": {"required": ["client_id", "secret"]},
            "mercadopago": {"required": ["access_token"]}
        }
        
        if gateway_name not in supported_gateways:
            return False
            
        required_fields = supported_gateways[gateway_name]["required"]
>>>>>>> 90d22681d2c30acb385206e300b3ba63575d2b65
        return all(field in config for field in required_fields)