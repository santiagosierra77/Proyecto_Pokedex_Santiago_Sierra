import { useEffect, useState } from 'react';
import axios from 'axios';

export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface Props {
  url: string;
  onSelect: (pokemon: PokemonData) => void;
}

export default function PokemonCard({ url, onSelect }: Props) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<PokemonData>(url)
      .then((res) => {
        setPokemon(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [url]);

  if (loading || !pokemon) {
    return (
      <div className="col-md-3 col-sm-6 mb-4">
        <div className="card h-100 align-items-center justify-content-center p-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-3 col-sm-6 mb-4" style={{ cursor: 'pointer' }} onClick={() => onSelect(pokemon)}>
      <div className="card h-100 text-center shadow-sm border-0 bg-light-hover card-animation">
        <div className="p-3">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            className="card-img-top img-fluid"
            alt={pokemon.name}
            style={{ maxHeight: '140px', objectFit: 'contain' }}
          />
        </div>
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <span className="text-muted small">#{pokemon.id.toString().padStart(3, '0')}</span>
            <h5 className="card-title text-capitalize mt-1 font-weight-bold" style={{ color: 'var(--text-h)' }}>
              {pokemon.name}
            </h5>
          </div>
          <div className="mt-2">
            {pokemon.types.map((t) => (
              <span key={t.type.name} className="badge bg-secondary text-capitalize me-1 px-2 py-1">
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}