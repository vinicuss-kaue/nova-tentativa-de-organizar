import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ImageBackground, Alert } from 'react-native';
import axios from 'axios';

const backgroundImage = require('./assets/pokemon.webp');

const GameScreen = ({ route, navigation }) => {
    const { playerName, correctCount: initialCorrectCount, incorrectCount: initialIncorrectCount } = route.params; // Recebe contagens iniciais
    const [pokemon, setPokemon] = useState(null);
    const [options, setOptions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [correctCount, setCorrectCount] = useState(initialCorrectCount); // Inicializa com a contagem recebida
    const [incorrectCount, setIncorrectCount] = useState(initialIncorrectCount); // Inicializa com a contagem recebida
    const [questionCount, setQuestionCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (questionCount < 10) {
            fetchPokemon();
        } else {
            handleGameOver(); // Chama a função de término de jogo
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
            setCorrectCount(prev => prev + 1); // Incrementa acertos
            showModal("Parabéns!", `Você acertou! O Pokémon era ${correctAnswer}.`, 'success');
        } else {
            setIncorrectCount(prev => prev + 1); // Incrementa erros
            showModal("Oops!", `Incorreto! O Pokémon era ${correctAnswer}.`, 'error');
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
            handleGameOver(); // Chama a função de término de jogo
        }
    };

    const handleGameOver = async () => {
      if (gameOver) return; // Previne múltiplas chamadas
  
      try {
          // Enviando uma solicitação para atualizar a pontuação do jogador
          const response = await axios.put(`http://192.168.1.106:3000/pontuacoes/${playerName}`, {
              acertos: correctCount,
              erros: incorrectCount,
          });
  
          // Verifique se a resposta foi bem-sucedida
          if (response.status === 200) {
              console.log('Pontuação atualizada com sucesso:', response.data);
          } else {
              console.error('Erro ao atualizar a pontuação:', response.data);
          }
      } catch (error) {
          console.error('Erro ao atualizar pontuação:', error.response ? error.response.data : error.message);
      }
  
      // Navega para a tela de ResultScreen com os resultados
      navigation.navigate('Result', {
          correct: correctCount,
          incorrect: incorrectCount,
          playerName: playerName,
      });
  
      setGameOver(true); // Atualiza o estado de gameOver
  };
  
    const resetGame = () => {
        setCorrectCount(0); // Zera os acertos
        setIncorrectCount(0); // Zera os erros
        setPokemon(null);
        setOptions([]);
        setCorrectAnswer('');
        setQuestionCount(0);
        setLoading(true);
        setGameOver(false);
        fetchPokemon(); // Carrega o primeiro Pokémon novamente
    };

    const navigateToHomeAndReset = () => {
        resetGame();
        navigation.navigate('Home'); // Volta para a tela inicial
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
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{modalType === 'error' ? 'Erro' : 'Sucesso'}</Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <Pressable style={styles.closeButton} onPress={handleModalClose}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
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
    loadingText: {
        fontSize: 20,
        color: '#fff',
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
        fontSize: 20,
        color: '#fff',
        marginBottom: 10,
    },
    optionButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
    },
    scoreText: {
        fontSize: 18,
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalMessage: {
        fontSize: 18,
        marginVertical: 10,
    },
    closeButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
});

export default GameScreen;