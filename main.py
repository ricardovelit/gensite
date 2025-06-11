# Punto de entrada principal del proyecto

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from typing import List, Dict, Optional
from datetime import datetime
import os
import shutil
import zipfile
from io import BytesIO
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import concurrent.futures
import re

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = "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"
openai.api_base = "https://api.openai.com/v1"

app = FastAPI(title="GENSITE AI API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gestor de conexiones WebSocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        if client_id not in self.active_connections:
            self.active_connections[client_id] = []
        self.active_connections[client_id].append(websocket)

    def disconnect(self, websocket: WebSocket, client_id: str):
        if client_id in self.active_connections:
            self.active_connections[client_id].remove(websocket)
            if not self.active_connections[client_id]:
                del self.active_connections[client_id]

    async def send_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                try:
                    await connection.send_text(message)
                except:
                    await self.disconnect(connection, client_id)

manager = ConnectionManager()

def sync_generate_code(prompt: str) -> Dict:
    try:
        # Selección de modelo
        model = os.environ.get('GENSITE_MODEL', 'gpt-4')
        if model == 'deepseek-coder':
            api_base = 'https://api.deepseek.com/v1'
            api_key = os.environ.get('DEEPSEEK_API_KEY', '')
        else:
            api_base = openai.api_base
            api_key = openai.api_key
        print(f"[GENSITE][USING MODEL]: {model}")
        system_message = '''You are an expert, senior web developer and React architect. Your job is to generate a complete, real, production-ready, professional React project based on the user's description.
        - Carefully analyze the user's prompt and deliver a real, high-quality, fully functional project structure, as if you were delivering it to a real client or for a real business.
        - The project must be usable, visually attractive, and ready for deployment.
        - Include ALL essential files: index.html, index.tsx, App.tsx, package.json (with all necessary dependencies for a real project), styles (CSS or MUI), components (in folders if needed), assets (images as placeholders if referenced), and any other file needed for a real React app.
        - Use TypeScript for all code files.
        - Use best practices: modular components, clear folder structure, reusable code, and professional naming.
        - If the user requests a portfolio, deliver a real, multi-section portfolio; if a landing page, deliver a real, modern landing, etc. Never return a minimal or test project.
        - Do NOT include explanations, markdown, or comments in the output. Only return the JSON object with the files.
        - The code must be ready to run and preview, with all imports and references correct.
        - The JSON object must have this structure:
        {
          "App.tsx": {"content": "...", "language": "typescript"},
          "index.tsx": {"content": "...", "language": "typescript"},
          "index.html": {"content": "...", "language": "html"},
          "package.json": {"content": "...", "language": "json"},
          ...
        }
        - Do not include explanations, markdown, or any text outside the JSON object. Only output the JSON object with the files.'''
        if model == 'deepseek-coder':
            import requests
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
            }
            payload = {
                "model": "deepseek-coder",
                "messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": f"Generate a complete, real, production-ready React project for: {prompt}"}
                ],
                "temperature": 0.7,
                "max_tokens": 3000
            }
            response = requests.post(f"{api_base}/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            generated = response.json()["choices"][0]["message"]["content"].strip()
        else:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": f"Generate a complete, real, production-ready React project for: {prompt}"}
                ],
                temperature=0.7,
                max_tokens=3000
            )
            generated = response["choices"][0]["message"]["content"].strip()
        print("\n[GENSITE][RAW AI RESPONSE]:\n", generated)
        # Limpiar y extraer el primer bloque JSON válido
        json_match = re.search(r'\{[\s\S]*\}', generated)
        if json_match:
            json_str = json_match.group(0)
        else:
            json_str = generated  # fallback
        try:
            files = json.loads(json_str)
            print("[GENSITE][PARSED FILES]:", list(files.keys()))
            # Validación: debe ser un dict y contener al menos App.tsx y index.html
            if not isinstance(files, dict) or not any(k.lower() == 'app.tsx' for k in files.keys()) or not any(k.lower() == 'index.html' for k in files.keys()):
                raise ValueError('Archivos esenciales faltantes')
            # Si falta styles.css, agrégalo vacío
            if 'styles.css' not in files:
                files['styles.css'] = {"content": "", "language": "css"}
            return {"files": files, "message": "Archivos generados exitosamente"}
        except Exception as e:
            print("[GENSITE][ERROR PARSING FILES JSON]:", e)
            # Proyecto React mínimo válido
            files = {
                "index.html": {"content": "<div id='root'></div>", "language": "html"},
                "index.tsx": {"content": "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './styles.css';\n\ncreateRoot(document.getElementById('root')).render(<App />);", "language": "typescript"},
                "App.tsx": {"content": "import React from 'react';\nexport default function App() {\n  return <h1>Proyecto React mínimo generado automáticamente</h1>;\n}", "language": "typescript"},
                "styles.css": {"content": "body { font-family: sans-serif; background: #f5f5f5; margin: 0; padding: 0; }", "language": "css"},
                "package.json": {"content": "{\n  \"name\": \"react-minimal\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.tsx\"\n}", "language": "json"}
            }
            return {"files": files, "message": "Se generó un proyecto mínimo por error de formato."}
    except Exception as e:
        print(f"[GENSITE][ERROR GENERATING CODE]: {str(e)}")
        return {
            "files": {"App.tsx": {"content": f"// Error generando el código\n// {str(e)}", "language": "typescript"}},
            "message": f"Error: {str(e)}"
        }

async def generate_code(prompt: str) -> Dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, sync_generate_code, prompt)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "generate":
                # Thinking phase
                await manager.send_message(
                    json.dumps({
                        "type": "thinking",
                        "data": {"message": "Analizando tu solicitud..."},
                        "timestamp": datetime.now().isoformat()
                    }),
                    client_id
                )
                await asyncio.sleep(1)

                # Writing phase
                await manager.send_message(
                    json.dumps({
                        "type": "writing",
                        "data": {"message": "Generando código..."},
                        "timestamp": datetime.now().isoformat()
                    }),
                    client_id
                )
                
                # Generate code (now returns multiple files)
                result = await generate_code(message["prompt"])
                files = result["files"]
                # Stream each file one by one
                for filename, fileinfo in files.items():
                    if not isinstance(fileinfo, dict):
                        continue
                    content = fileinfo.get('content', None)
                    if content is None or not isinstance(content, str):
                        continue
                    if not content.strip() or content.strip() == 'undefined':
                        continue
                    # Refuerzo especial para package.json
                    if filename == 'package.json':
                        try:
                            import json as _json
                            _json.loads(content)
                        except Exception:
                            fileinfo['content'] = '{\n  "name": "react-minimal",\n  "version": "1.0.0",\n  "main": "index.tsx"\n}'
                    print(f"[GENSITE][STREAMING FILE]: {filename}")
                    await manager.send_message(
                        json.dumps({
                            "type": "stream",
                            "data": {"files": {filename: fileinfo}},
                            "timestamp": datetime.now().isoformat()
                        }),
                        client_id
                    )
                    await asyncio.sleep(0.1)
                # Analyzing phase
                await manager.send_message(
                    json.dumps({
                        "type": "analyzing",
                        "data": {"message": "Verificando los archivos generados..."},
                        "timestamp": datetime.now().isoformat()
                    }),
                    client_id
                )
                await asyncio.sleep(0.5)
                # Send completed with all files
                await manager.send_message(
                    json.dumps({
                        "type": "completed",
                        "data": {
                            "files": files,
                            "message": result["message"]
                        },
                        "timestamp": datetime.now().isoformat()
                    }),
                    client_id
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
    except Exception as e:
        print(f"Error in websocket: {str(e)}")
        try:
            await manager.send_message(
                json.dumps({
                    "type": "error",
                    "data": {
                        "message": f"Error: {str(e)}",
                        "files": {"App.tsx": {"content": "// Error en la generación de código", "language": "typescript"}}
                    },
                    "timestamp": datetime.now().isoformat()
                }),
                client_id
            )
        except:
            pass

@app.get("/")
async def root():
    return {"message": "Bienvenido a GENSITE AI API"}

# Create project directory if it doesn't exist
PROJECT_DIR = "generated_project"
os.makedirs(PROJECT_DIR, exist_ok=True)

class FileContent(BaseModel):
    name: str
    content: str
    language: str

@app.post("/api/files")
async def create_file(file: FileContent):
    try:
        file_path = os.path.join(PROJECT_DIR, file.name)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(file.content)
        return {"message": f"File {file.name} created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files/{filename}")
async def get_file(filename: str):
    try:
        file_path = os.path.join(PROJECT_DIR, filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files/download")
async def download_project():
    try:
        # Create a BytesIO object to store the zip file
        zip_io = BytesIO()
        
        # Create the zip file
        with zipfile.ZipFile(zip_io, mode='w', compression=zipfile.ZIP_DEFLATED) as temp_zip:
            # Walk through the project directory
            for foldername, subfolders, filenames in os.walk(PROJECT_DIR):
                for filename in filenames:
                    # Create complete filepath of file in directory
                    file_path = os.path.join(foldername, filename)
                    # Add file to zip
                    arcname = os.path.relpath(file_path, PROJECT_DIR)
                    temp_zip.write(file_path, arcname=arcname)
        
        # Seek to the beginning of the BytesIO object
        zip_io.seek(0)
        
        # Return the zip file as a streaming response
        return StreamingResponse(
            iter([zip_io.getvalue()]),
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=project.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    # Limpia archivos dentro de la carpeta, pero no la carpeta
    os.makedirs(PROJECT_DIR, exist_ok=True)
    if os.path.exists(PROJECT_DIR):
        for filename in os.listdir(PROJECT_DIR):
            file_path = os.path.join(PROJECT_DIR, filename)
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)