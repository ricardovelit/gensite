import tkinter as tk
from tkinter import ttk, filedialog
from generator import CodeGenerator

class GeneratorUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Generador NO-CODE")
        self.root.geometry("800x600")
        self.generator = CodeGenerator()
        
        # Configurar estilo
        self.style = ttk.Style()
        self.style.configure('TFrame', background='#f0f0f0')
        self.style.configure('TLabel', background='#f0f0f0')
        
        self.create_widgets()
    
    def create_widgets(self):
        """Crea los elementos de la interfaz"""
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Panel principal dividido
        paned_window = ttk.PanedWindow(main_frame, orient=tk.HORIZONTAL)
        paned_window.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Panel izquierdo - Editor visual
        editor_frame = ttk.Frame(paned_window, width=400, relief=tk.RIDGE, padding=10)
        paned_window.add(editor_frame)
        
        ttk.Label(editor_frame, text="Editor Visual", font=('Arial', 12)).pack(pady=5)
        
        # Área de arrastrar/soltar
        self.drop_area = ttk.Label(editor_frame, text="Arrastra componentes aquí", 
                                 relief=tk.SUNKEN, width=40, height=15)
        self.drop_area.pack(pady=10)
        
        # Panel derecho - Previsualización
        preview_frame = ttk.Frame(paned_window, width=400, relief=tk.RIDGE, padding=10)
        paned_window.add(preview_frame)
        
        ttk.Label(preview_frame, text="Previsualización", font=('Arial', 12)).pack(pady=5)
        self.preview_label = ttk.Label(preview_frame, text="Previsualización aparecerá aquí", 
                                      relief=tk.SUNKEN, width=40, height=15)
        self.preview_label.pack(pady=10)
        
        # Barra inferior - Controles
        control_frame = ttk.Frame(main_frame)
        control_frame.grid(row=1, column=0, columnspan=2, pady=10)
        
        # Botones
        ttk.Button(control_frame, text="Plantillas", command=self.show_templates).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="Generar", command=self.generate).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="Exportar", command=self.export).pack(side=tk.LEFT, padx=5)
        
        # Estado
        self.status_var = tk.StringVar()
        self.status_var.set("Listo")
        ttk.Label(main_frame, textvariable=self.status_var).grid(row=2, column=0, columnspan=2)
    
    def show_templates(self):
        """Muestra un diálogo con plantillas disponibles"""
        templates = self.generator.get_available_templates()
        template_dialog = tk.Toplevel(self.root)
        template_dialog.title("Plantillas disponibles")
        
        for i, template in enumerate(templates):
            ttk.Button(template_dialog, text=template, 
                      command=lambda t=template: self.select_template(t)).grid(row=i, column=0, padx=5, pady=2)
    
    def select_template(self, template_name):
        """Selecciona una plantilla para usar"""
        self.current_template = template_name
        self.status_var.set(f"Plantilla seleccionada: {template_name}")
    
    def generate(self):
        """Maneja la generación del sitio web"""
        if not hasattr(self, 'current_template'):
            self.status_var.set("Selecciona una plantilla primero")
            return
            
        output_dir = filedialog.askdirectory(title="Seleccionar directorio de salida")
        if output_dir:
            self.status_var.set("Generando...")
            self.root.update()
            
            try:
                result = self.generator.generate_website(
                    template_name=self.current_template,
                    output_dir=output_dir
                )
                self.status_var.set(f"Sitio generado en: {result}")
            except Exception as e:
                self.status_var.set(f"Error: {str(e)}")
    
    def export(self):
        """Exporta el proyecto actual"""
        file_path = filedialog.asksaveasfilename(
            title="Exportar proyecto",
            defaultextension=".zip",
            filetypes=[("Archivo ZIP", "*.zip")]
        )
        if file_path:
            self.status_var.set("Exportando...")
            self.root.update()
            
            try:
                self.generator.export_project(file_path)
                self.status_var.set(f"Proyecto exportado: {file_path}")
            except Exception as e:
                self.status_var.set(f"Error al exportar: {str(e)}")