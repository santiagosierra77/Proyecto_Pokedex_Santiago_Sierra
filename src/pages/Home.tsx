// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import { type PokemonData } from '../interfaces/pokemon';
import PokemonDetail from '../components/PokemonDetail';

export interface PokemonBase {
  name: string;
  url: string;
}

export interface PokeAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBase[];
}

export default function Home() {
  // Guardamos TODOS los 150 Pokémon aquí para la búsqueda global
  const [allPokemon, setAllPokemon] = useState<PokemonBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);

  // Control de paginación interna (Local)
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12; 

  useEffect(() => {
    setLoading(true);
    // Traemos los 150 Pokémon completos de una sola vez para que la búsqueda sea global
    axios.get<PokeAPIResponse>('https://pokeapi.co/api/v2/pokemon?limit=150&offset=0')
      .then((res) => {
        setAllPokemon(res.data.results);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading || allPokemon.length === 0) {
    return (
      <div id="center" className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Cargando los 150 Pokémon originales...</p>
      </div>
    );
  }

  // 1. FILTRO GLOBAL: Busca en la lista completa de 150, sin importar la página
  const filteredPokemon = allPokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. PAGINACIÓN LOCAL: Cortamos la lista filtrada para mostrar solo 12 por página
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentItemsToDisplay = filteredPokemon.slice(indexOfFirstItem, indexOfLastItem);

  // Si el usuario le da clic a un Pokémon, mostramos su detalle
  if (selectedPokemon) {
    return (
      <PokemonDetail 
        pokemon={selectedPokemon} 
        onBack={() => setSelectedPokemon(null)} 
      />
    );
  }

  // Cálculos dinámicos para los botones Siguiente/Anterior basados en los resultados reales
  const totalPages = Math.ceil(filteredPokemon.length / limit);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div id="center" className="container my-4">
      <header className="hero text-center mb-4">
        <h1 className="display-4 font-weight-bold">Pokédex</h1>
        <p className="text-muted">¡Explorando los primeros 150 Pokémon originales!</p>
      </header>

      {/* Barra de búsqueda global */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            placeholder="🔍 Buscar cualquier Pokémon (Ej: Pikachu, Mew, Charizard)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reinicia a la página 1 al escribir para no perder los resultados
            }}
          />
        </div>
      </div>

      {/* Grid de Pokémon en base a lo que se debe mostrar */}
      <div className="row w-100 justify-content-center">
        {currentItemsToDisplay.length > 0 ? (
          currentItemsToDisplay.map((p) => (
            <PokemonCard 
              key={p.name} 
              url={p.url} 
              onSelect={(pokemon) => setSelectedPokemon(pokemon)} 
            />
          ))
        ) : (
          <div className="text-center my-5">
            <p className="text-muted fs-4">No se encontró ningún Pokémon con "{searchTerm}" en los 150 originales.</p>
          </div>
        )}
      </div>

      {/* Controles de paginación inteligentes (se adaptan si estás buscando) */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-3 my-4 w-100">
          <button
            className="btn btn-outline-primary px-4 py-2"
            disabled={!hasPrevious}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          
          <span className="align-self-center font-weight-bold">
            Página {currentPage} de {totalPages}
          </span>

          <button
            className="btn btn-primary px-4 py-2"
            disabled={!hasNext}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
      
      <div id="spacer"></div>
    </div>
  );
}