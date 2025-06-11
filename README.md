# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# GENSITE AI Website Builder

## Selección de modelo de IA para generación de código

El backend soporta dos modelos de IA para la generación de proyectos React:

- **gpt-4** (OpenAI, por defecto)
- **deepseek-coder** (Deepseek, alternativo)

### Uso por defecto (gpt-4)
No necesitas definir ninguna variable de entorno. El backend usará gpt-4 automáticamente para generar el código.

### Uso de Deepseek como alternativa
Si quieres usar Deepseek, define las siguientes variables de entorno antes de iniciar el backend:

#### En Windows PowerShell:
```powershell
$env:GENSITE_MODEL="deepseek-coder"
$env:DEEPSEEK_API_KEY="tu_api_key_deepseek"
```

#### En Linux/MacOS:
```bash
export GENSITE_MODEL=deepseek-coder
export DEEPSEEK_API_KEY=tu_api_key_deepseek
```

Luego inicia el backend normalmente (por ejemplo, con Uvicorn):
```bash
uvicorn main:app --reload
```

### Notas
- Si no defines `GENSITE_MODEL`, el backend usará **gpt-4**.
- Si defines `GENSITE_MODEL=deepseek-coder`, debes proporcionar también tu `DEEPSEEK_API_KEY`.
- El modelo usado se muestra en la consola del backend con el log `[GENSITE][USING MODEL]: ...`.

---

¿Dudas? Consulta el código en `main.py` o pide ayuda en el chat de soporte.
