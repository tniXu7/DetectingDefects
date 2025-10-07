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
    const deltaX = mousePosition.x - (position.x + 40); // Центр персонажа
    const deltaY = mousePosition.y - (position.y + 40);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 0) {
      // Ограничиваем максимальное расстояние слежения
      const maxDistance = 200;
      const clampedDistance = Math.min(distance, maxDistance);
      
      const normalizedX = (deltaX / clampedDistance) * Math.min(1, clampedDistance / 100);
      const normalizedY = (deltaY / clampedDistance) * Math.min(1, clampedDistance / 100);
      
      setEyePosition({
        x: Math.max(-4, Math.min(4, normalizedX * 4)),
        y: Math.max(-3, Math.min(3, normalizedY * 3))
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
      color: '#2C2C2C',
      shape: 'round',
      position: { x: 50, y: 200 }
    },
    {
      id: 2,
      color: '#6B6B6B',
      shape: 'tall',
      position: { x: 150, y: 180 }
    },
    {
      id: 3,
      color: '#9E9E9E',
      shape: 'medium',
      position: { x: 250, y: 190 }
    },
    {
      id: 4,
      color: '#E0E0E0',
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
