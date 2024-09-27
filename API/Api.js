import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

export const fetchRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs vão até 898
  try {
    const response = await axios.get(`${API_URL}${randomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    return null;
  }
};

export const fetchPokemons = async (count = 4) => {
  const promises = [];
  for (let i = 0; i < count; i++) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    promises.push(axios.get(`${API_URL}${randomId}`));
  }
  try {
    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Error fetching Pokémons:', error);
    return [];
  }
};