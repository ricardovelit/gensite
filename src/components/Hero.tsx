import React, { useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';

export const Hero = () => {
  const [text, setText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <section className="hero">
      <h1>Dile a la IA qué sitio quieres. Mira cómo lo crea en segundos</h1>
      
      <div className="dialog-box">
        <textarea 
          placeholder="Describe tu sitio web, yo lo hago por ti..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2500}
        />
        <Typewriter
          words={['Describe tu sitio web, yo lo hago por ti...']}
          loop={false}
          cursor
          cursorStyle='|'
          typeSpeed={70}
          deleteSpeed={50}
        />
        
        <div className="dialog-actions">
          <button className="create-button">
            <span>Crear con IA</span>
          </button>
          
          {isLoggedIn ? (
            <button className="user-button">
              <span>Usuario</span>
            </button>
          ) : (
            <button className="supabase-button">
              <span>Conectar con Supabase</span>
            </button>
          )}
          
          <button className="start-button">
            <span>→</span>
          </button>
        </div>
      </div>
      
      <p className="subtext">
        Conecta tu backend, compra un dominio y lanza tu web en minutos. Todo desde una sola plataforma.
      </p>
    </section>
  );
};