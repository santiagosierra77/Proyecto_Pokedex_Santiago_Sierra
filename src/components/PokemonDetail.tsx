// src/components/PokemonDetail.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { type PokemonData } from '../interfaces/pokemon';

interface Props {
  pokemon: PokemonData;
  onBack: () => void;
}

// Interfaz extendida localmente para capturar los datos extra de la API de una vez
interface FullPokemonDetails extends PokemonData {
  height: number;
  weight: number;
  abilities: {
    ability: { name: string };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  moves: {
    move: { name: string };
  }[];
}

export default function PokemonDetail({ pokemon, onBack }: Props) {
  const [detail, setDetail] = useState<FullPokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos el ID del pokemon seleccionado para traer su ficha técnica completa
    axios.get<FullPokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
      .then((res) => {
        setDetail(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [pokemon.id]);

  if (loading || !detail) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Cargando datos biológicos de la Pokédex...</p>
      </div>
    );
  }

  // Helper para cambiar el color de las barras de estadísticas según el nivel
  const getProgressBarColor = (statName: string) => {
    if (statName === 'hp') return 'bg-success';
    if (statName === 'attack') return 'bg-danger';
    if (statName === 'defense') return 'bg-warning';
    return 'bg-info';
  };

  return (
    <div className="container my-5 animate-fade-in text-dark">
      {/* Botón de navegación hacia atrás */}
      <button className="btn btn-dark shadow-sm mb-4 px-4 py-2" onClick={onBack}>
        ← Volver a la Pokédex
      </button>
      
      <div className="card shadow-lg border-0 p-4 bg-white rounded-4 m-auto" style={{ maxWidth: '850px' }}>
        <div className="row align-items-center">
          
          {/* COLUMNA IZQUIERDA: Tarjeta Visual Grande */}
          <div className="col-md-5 text-center border-end-md mb-4 mb-md-0">
            <span className="text-muted h4 d-block mb-1">#{detail.id.toString().padStart(3, '0')}</span>
            <h1 className="text-capitalize font-weight-bold display-4 mb-3" style={{ color: 'var(--text-h)' }}>
              {detail.name}
            </h1>
            
            <div className="p-3 bg-light rounded-4 shadow-inner mb-3">
              <img 
                src={detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default} 
                alt={detail.name} 
                className="img-fluid img-animated"
                style={{ width: '100%', maxHeight: '280px', objectFit: 'contain' }}
              />
            </div>

            {/* Medallas de Tipos grandes */}
            <div className="mb-2">
              {detail.types.map((t) => (
                <span key={t.type.name} className="badge bg-primary text-capitalize fs-6 mx-1 px-3 py-2 shadow-sm">
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: Datos Técnicos y Estadísticas */}
          <div className="col-md-7 ps-md-4">
            
            {/* Dimensiones Corporales */}
            <h4 className="border-bottom pb-2 mb-3 font-weight-bold">Ficha Biológica</h4>
            <div className="row text-center mb-4">
              <div className="col-6 bg-light rounded p-2 border-end border-white">
                <h6 className="text-muted small mb-1">ALTURA</h6>
                <p className="font-weight-bold mb-0">{(detail.height / 10)} m</p>
              </div>
              <div className="col-6 bg-light rounded p-2">
                <h6 className="text-muted small mb-1">PESO</h6>
                <p className="font-weight-bold mb-0">{(detail.weight / 10)} kg</p>
              </div>
            </div>

            {/* Habilidades Especiales */}
            <h5 className="font-weight-bold">Habilidades</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {detail.abilities.map((a) => (
                <span key={a.ability.name} className="badge bg-dark text-capitalize px-3 py-2">
                  {a.ability.name.replace('-', ' ')}
                </span>
              ))}
            </div>

            {/* Estadísticas de Combate Reales (Barras de progreso) */}
            <h4 className="border-bottom pb-2 mb-3 font-weight-bold">Estadísticas Base</h4>
            <div className="stats-box mb-4">
              {detail.stats.map((s) => (
                <div key={s.stat.name} className="mb-2">
                  <div className="d-flex justify-content-between text-capitalize small font-weight-bold mb-1">
                    <span>{s.stat.name.replace('-', ' ')}</span>
                    <span>{s.base_stat}</span>
                  </div>
                  <div className="progress" style={{ height: '12px', borderRadius: '6px' }}>
                    <div 
                      className={`progress-bar progress-bar-striped progress-bar-animated ${getProgressBarColor(s.stat.name)}`} 
                      role="progressbar" 
                      style={{ width: `${Math.min((s.base_stat / 150) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Movimientos Principales */}
            <h5 className="font-weight-bold">Primeros Movimientos del Set</h5>
            <div className="d-flex flex-wrap gap-1">
              {detail.moves.slice(0, 6).map((m) => (
                <span key={m.move.name} className="badge bg-light text-dark border text-capitalize px-2 py-1 small">
                  {m.move.name.replace('-', ' ')}
                </span>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}