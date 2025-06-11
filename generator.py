import json
from pathlib import Path

class CodeGenerator:
    def __init__(self, config_path='config.json'):
        with open(config_path) as f:
            self.config = json.load(f)
        
    def generate_website(self, template_name, output_dir='output'):
        """
        Genera un sitio web básico con la estructura inicial
        Args:
            template_name: Nombre del template a usar
            output_dir: Directorio de salida para los archivos
        """
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Crear archivos básicos según lenguajes soportados
        if 'HTML' in self.config['supported_languages']:
            with open(output_path/'index.html', 'w') as f:
                f.write('<!DOCTYPE html>\n<html>\n<head>\n<title>Generated Website</title>\n</head>\n<body>\n<h1>Welcome to your generated website!</h1>\n</body>\n</html>')
        
        if 'CSS' in self.config['supported_languages']:
            with open(output_path/'styles.css', 'w') as f:
                f.write('body { font-family: Arial, sans-serif; margin: 20px; }\nh1 { color: #333; }')
        
        if 'JavaScript' in self.config['supported_languages']:
            with open(output_path/'app.js', 'w') as f:
                f.write('console.log("Website generated successfully!");')
        
        return str(output_path.absolute())