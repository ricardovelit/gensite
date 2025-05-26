"""
Módulo para control de calidad automático en GENSITE

Funcionalidades:
- Integración con ESLint/Prettier
- Validación W3C
- Notificaciones visuales de errores
"""
import subprocess
import requests
import json
from typing import Dict

class QualityChecker:
    """Clase principal para el control de calidad"""
    
    def __init__(self):
        # Configuración para Chrome Headless
        self.chrome_options = Options()
        self.chrome_options.add_argument('--headless')
        self.chrome_options.add_argument('--disable-gpu')
        self.chrome_options.add_argument('--no-sandbox')
        
        # Configuración para OWASP ZAP
        self.zap_path = "zap.sh" if os.name != 'nt' else "zap.bat"
        self.zap_port = 8080
        self.zap_api_key = os.getenv('ZAP_API_KEY', 'default_key')
        
        self.eslint_config = {
            "extends": ["eslint:recommended"],
            "rules": {
                "indent": ["error", 2],
                "linebreak-style": ["error", "unix"],
                "quotes": ["error", "single"],
                "semi": ["error", "always"]
            }
        }
        self.prettier_config = {
            "printWidth": 80,
            "tabWidth": 2,
            "useTabs": False,
            "semi": True,
            "singleQuote": True,
            "trailingComma": "es5"
        }
        self.w3c_validator_url = "https://validator.w3.org/nu/"
    
    def run_eslint(self, file_path: str) -> Dict:
        """Ejecuta ESLint en el archivo especificado"""
        try:
            result = subprocess.run(
                ["eslint", "-f", "json", file_path],
                capture_output=True,
                text=True
            )
            return json.loads(result.stdout)
        except Exception as e:
            return {"error": str(e)}
    
    def run_prettier(self, file_path: str) -> str:
        """Formatea el archivo con Prettier"""
        try:
            result = subprocess.run(
                ["prettier", "--write", file_path],
                capture_output=True,
                text=True
            )
            return result.stdout
        except Exception as e:
            return str(e)
    
    def validate_w3c(self, html_content: str) -> Dict:
        """Valida el HTML con el validador W3C"""
        try:
            response = requests.post(
                self.w3c_validator_url,
                data=html_content,
                headers={"Content-Type": "text/html; charset=utf-8"}
            )
            return response.json()
        except Exception as e:
            return {"error": str(e)}

    def run_lighthouse(self, url: str) -> Dict:
        """Ejecuta análisis Lighthouse en la URL especificada"""
        try:
            # Configurar ChromeDriver
            capabilities = DesiredCapabilities.CHROME
            capabilities['goog:loggingPrefs'] = {'performance': 'ALL'}
            
            driver = webdriver.Chrome(options=self.chrome_options, desired_capabilities=capabilities)
            driver.get(url)
            
            # Ejecutar Lighthouse via Node
            result = subprocess.run(
                ["lighthouse", url, "--output=json", "--quiet", "--chrome-flags='--headless'"],
                capture_output=True,
                text=True
            )
            
            driver.quit()
            return json.loads(result.stdout)
        except Exception as e:
            return {"error": str(e)}
    
    def run_zap_scan(self, target_url: str) -> Dict:
        """Ejecuta escaneo de seguridad con OWASP ZAP"""
        try:
            # Iniciar ZAP
            subprocess.Popen([self.zap_path, "-daemon", 
                            f"-port={self.zap_port}", 
                            f"-config api.key={self.zap_api_key}"])
            
            # Esperar que ZAP inicie
            time.sleep(10)
            
            # Configurar escaneo
            zap = ZAPv2(apikey=self.zap_api_key, proxies={
                'http': f'http://127.0.0.1:{self.zap_port}',
                'https': f'http://127.0.0.1:{self.zap_port}'
            })
            
            # Ejecutar escaneo activo
            scan_id = zap.ascan.scan(target_url)
            
            # Esperar resultados
            while int(zap.ascan.status(scan_id)) < 100:
                time.sleep(5)
            
            # Obtener reporte
            report = zap.core.jsonreport()
            
            # Detener ZAP
            zap.core.shutdown()
            
            return json.loads(report)
        except Exception as e:
            return {"error": str(e)}
    
    def check_all(self, file_path: str, html_content: str, url: str = None) -> Dict:
        """Ejecuta todas las validaciones"""
        results = {
            "eslint": self.run_eslint(file_path),
            "prettier": self.run_prettier(file_path),
            "w3c": self.validate_w3c(html_content)
        }
        
        if url:
            results["lighthouse"] = self.run_lighthouse(url)
            results["zap_scan"] = self.run_zap_scan(url)
            
            # Verificar puntaje mínimo
            if 'lighthouse' in results and 'categories' in results['lighthouse']:
                for category in results['lighthouse']['categories'].values():
                    if category['score'] * 100 < 90:
                        results['lighthouse_warning'] = f"Puntaje bajo en {category['title']}: {category['score'] * 100}"
            
            # Verificar vulnerabilidades críticas
            if 'zap_scan' in results and 'site' in results['zap_scan']:
                for site in results['zap_scan']['site']:
                    for alert in site['alerts']:
                        if alert['risk'] == 'High':
                            results['zap_warning'] = f"Vulnerabilidad crítica detectada: {alert['name']}"
                            break
        
        return results