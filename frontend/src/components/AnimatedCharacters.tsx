import React, { useState, useEffect, useRef } from 'react';
import './AnimatedCharacters.css';

interface CharacterProps {
  id: number;
  color: string;
  shape: string;
  position: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isHappy: boolean;
  isSad: boolean;
}

const Character: React.FC<CharacterProps> = ({ 
  id, 
  color, 
  shape, 
  position, 
  mousePosition, 
  isHappy, 
  isSad 
}) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [mouthShape, setMouthShape] = useState('happy');

  useEffect(() => {
    // Вычисляем направление взгляда к курсору
    const deltaX = mousePosition.x - position.x;
    const deltaY = mousePosition.y - position.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 0) {
      const normalizedX = Math.max(-1, Math.min(1, deltaX / distance));
      const normalizedY = Math.max(-1, Math.min(1, deltaY / distance));
      
      setEyePosition({
        x: normalizedX * 3,
        y: normalizedY * 2
      });
    }
  }, [mousePosition, position]);

  useEffect(() => {
    if (isSad) {
      setMouthShape('sad');
    } else if (isHappy) {
      setMouthShape('happy');
    } else {
      setMouthShape('neutral');
    }
  }, [isHappy, isSad]);

  return (
    <div 
      className={`character character-${id} character-${shape}`}
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: color,
      }}
    >
      {/* Глаза */}
      <div className="eyes">
        <div 
          className="eye left-eye"
          style={{
            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
          }}
        />
        <div 
          className="eye right-eye"
          style={{
            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
          }}
        />
      </div>
      
      {/* Рот */}
      <div className={`mouth ${mouthShape}`} />
    </div>
  );
};

interface AnimatedCharactersProps {
  mousePosition: { x: number; y: number };
  loginState: 'idle' | 'error' | 'success';
}

const AnimatedCharacters: React.FC<AnimatedCharactersProps> = ({ 
  mousePosition, 
  loginState 
}) => {
  const [characters, setCharacters] = useState([
    {
      id: 1,
      color: '#FF6B6B',
      shape: 'round',
      position: { x: 50, y: 200 }
    },
    {
      id: 2,
      color: '#4ECDC4',
      shape: 'tall',
      position: { x: 150, y: 180 }
    },
    {
      id: 3,
      color: '#45B7D1',
      shape: 'medium',
      position: { x: 250, y: 190 }
    },
    {
      id: 4,
      color: '#FFA07A',
      shape: 'wide',
      position: { x: 350, y: 200 }
    }
  ]);

  const isHappy = loginState === 'success';
  const isSad = loginState === 'error';

  return (
    <div className="characters-container">
      {characters.map((character) => (
        <Character
          key={character.id}
          {...character}
          mousePosition={mousePosition}
          isHappy={isHappy}
          isSad={isSad}
        />
      ))}
    </div>
  );
};

export default AnimatedCharacters;
