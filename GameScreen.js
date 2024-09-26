import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ImageBackground, TextInput } from 'react-native';
import axios from 'axios';

const backgroundImage = require('./assets/pokemon.webp');

const GameScreen = ({ route, navigation }) => {
  const [pokemon, setPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState(route.params.playerName || ""); // Recebe o nome do jogador ou usa um valor padrão

  useEffect(() => {
    if (questionCount < 10) {
      fetchPokemon();
    } else {
      handleGameOver();
    }
  }, [questionCount]);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const randomId = Math.floor(Math.random() * 898) + 1;
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const name = data.name;
      setPokemon({ name, image: data.sprites.front_default });
      generateOptions(name);
    } catch (error) {
      console.error(error);
      setLoading(false);
      showModal("Erro", "Falha ao carregar Pokémon. Tente novamente.", 'error');
    }
  };

  const generateOptions = async (correct) => {
    const ids = new Set();
    ids.add(Math.floor(Math.random() * 898) + 1);
    
    while (ids.size < 4) {
      ids.add(Math.floor(Math.random() * 898) + 1);
    }

    const fetchPokemonName = async (id) => {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return data.name;
    };

    const names = await Promise.all(Array.from(ids).map(id => fetchPokemonName(id)));
    if (!names.includes(correct)) {
      names[Math.floor(Math.random() * names.length)] = correct;
    }

    setOptions(shuffle(names));
    setCorrectAnswer(correct);
    setLoading(false);
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleOptionPress = (selected) => {
    if (selected === correctAnswer) {
      setCorrectCount(prev => prev + 1);
      showModal("Parabéns!", "Você acertou! O Pokémon era " + correctAnswer + ".", 'success');
    } else {
      setIncorrectCount(prev => prev + 1);
      showModal("Oops!", "Incorreto! O Pokémon era " + correctAnswer + ".", 'error');
    }
  };

  const showModal = (title, message, type) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (questionCount < 9) {
      setQuestionCount(prev => prev + 1);
    } else {
      setGameOver(true);
      handleGameOver(); // Chama handleGameOver ao final do jogo
    }
  };

  const handleGameOver = async () => {
    try {
      const response = await axios.post('http://<SEU_IP_LOCAL>:3000/register', {
        name: playerName,
        score: correctCount,
      });

      if (response.status === 201) {
        console.log('Jogador registrado com sucesso:', response.data);
      }

      navigation.navigate('Result', {
        score: {
          correct: correctCount,
          incorrect: incorrectCount,
        },
      });
    } catch (error) {
      console.error('Erro ao registrar jogador:', error);
      alert('Erro ao registrar jogador. Tente novamente.');
    }
  };

  const resetGame = () => {
    setPokemon(null);
    setOptions([]);
    setCorrectAnswer('');
    setCorrectCount(0);
    setIncorrectCount(0);
    setQuestionCount(0);
    setLoading(true);
    setGameOver(false);
    fetchPokemon();
  };

  const navigateToHomeAndReset = () => {
    resetGame();
    navigation.navigate('Home');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={playerName}
          onChangeText={setPlayerName}
        />
        {pokemon && !gameOver && (
          <>
            <Image source={{ uri: pokemon.image }} style={styles.pokemonImage} />
            <Text style={styles.question}>Qual é este Pokémon?</Text>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Acertos: {correctCount}</Text>
              <Text style={styles.scoreText}>Erros: {incorrectCount}</Text>
            </View>
          </>
        )}
        {gameOver && (
          <View style={styles.buttonsContainer}>
            <Button
              title="Voltar para Início"
              onPress={navigateToHomeAndReset}
              color="#FF6347"
            />
            <Button
              title="Jogar Novamente"
              onPress={resetGame}
              color="#4CAF50"
            />
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, modalType === 'success' ? styles.success : styles.error]}>
            <Text style={styles.modalTitle}>{modalType === 'success' ? "Parabéns!" : "Oops!"}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Pressable style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#000',
    fontSize: 18,
  },
  scoreContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default GameScreen;