"""
Módulo para manejar la conexión y operaciones con Supabase

Proporciona funcionalidades para:
- Autenticación de usuarios
- Operaciones CRUD
- Sincronización en tiempo real
"""
import os
from supabase import create_client, Client
from typing import Optional, Dict, Any, List

class SupabaseHandler:
    """
    Manejador para interactuar con la base de datos Supabase.
    Implementa operaciones CRUD para las tablas:
    - usuarios
    - plantillas
    - proyectos
    - configuraciones
    """
    
    def __init__(self, url: Optional[str] = None, key: Optional[str] = None):
        """Inicializa el cliente de Supabase"""
        self.url: str = url or os.environ.get('SUPABASE_URL', 'https://ycihyaoljvvxayblhlvb.supabase.co')
        self.key: str = key or os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljaWh5YW9sanZ2eGF5YmxobHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjc5NjQsImV4cCI6MjA2MzcwMzk2NH0.gvQD4gEdX4bfvT-WY5d2s6tgqAlYIvu7q8AY3SuTCNQ')
        self.client: Optional[Client] = None
        
        if not self.url or not self.key:
            raise ValueError("Se requieren SUPABASE_URL y SUPABASE_KEY para la conexión")
        
        try:
            self.client = create_client(self.url, self.key)
        except Exception as e:
            raise ConnectionError(f"Error al conectar con Supabase: {str(e)}")
    
    def autenticar(self, email: str, password: str):
        """Autentica un usuario con email y contraseña"""
        return self.client.auth.sign_in_with_password({"email": email, "password": password})
    
    def insertar(self, tabla: str, datos: dict):
        """Inserta datos en una tabla"""
        return self.client.from_(tabla).insert(datos).execute()
    
    def obtener(self, tabla: str, filtros: dict = None):
        """Obtiene datos de una tabla con filtros opcionales"""
        query = self.client.from_(tabla).select('*')
        if filtros:
            for key, value in filtros.items():
                query = query.eq(key, value)
        return query.execute()
    
    def actualizar(self, tabla: str, datos: dict, filtros: dict):
        """Actualiza datos en una tabla"""
        query = self.client.from_(tabla).update(datos)
        for key, value in filtros.items():
            query = query.eq(key, value)
        return query.execute()
    
    def eliminar(self, tabla: str, filtros: dict):
        """Elimina datos de una tabla"""
        query = self.client.from_(tabla).delete()
        for key, value in filtros.items():
            query = query.eq(key, value)
        return query.execute()
    
    def suscribir(self, tabla: str, callback):
        """Suscribe a cambios en tiempo real"""
        return self.client.from_(tabla).on('*', callback).subscribe()