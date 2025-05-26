-- Tabla de usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre TEXT,
  apellido TEXT,
  rol TEXT DEFAULT 'usuario',
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de plantillas
CREATE TABLE plantillas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  contenido_html TEXT NOT NULL,
  estilos_css TEXT,
  scripts_js TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW(),
  creado_por UUID REFERENCES usuarios(id)
);

-- Tabla de proyectos
CREATE TABLE proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  url_slug TEXT UNIQUE,
  plantilla_id UUID REFERENCES plantillas(id),
  configuracion JSONB,
  publicado BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW(),
  creado_por UUID REFERENCES usuarios(id)
);

-- Tabla de configuraciones
CREATE TABLE configuraciones (
  clave TEXT PRIMARY KEY,
  valor JSONB NOT NULL,
  descripcion TEXT,
  actualizado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_por UUID REFERENCES usuarios(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_proyectos_usuario ON proyectos(creado_por);
CREATE INDEX idx_plantillas_usuario ON plantillas(creado_por);

-- Disparador para actualizar automáticamente el campo actualizado_en
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuarios_actualizado
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER plantillas_actualizado
BEFORE UPDATE ON plantillas
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER proyectos_actualizado
BEFORE UPDATE ON proyectos
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp();