const API_URL = "https://pokeapi.co/api/v2";


export const getPokemons = async () => {


    const response = await fetch(
        `${API_URL}/pokemon?limit=20`
    );


    const data = await response.json();


    const pokemonList = await Promise.all(

        data.results.map(async(jairo : any)=>{


            const response = await fetch(jairo.url);

            const details = await response.json();


            return {

                id: details.id,

                name: details.name,

                image: details.sprites.front_default,

                type: details.types[0].type.name

            }


        })

    );


    return pokemonList;

}