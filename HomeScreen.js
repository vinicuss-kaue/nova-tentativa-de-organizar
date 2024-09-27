import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ImageBackground, Alert } from 'react-native';
import axios from 'axios'; // Importando axios para realizar requisições à API

// Importar a imagem local
const backgroundImage = require('./assets/images.jpg'); // Caminho para a imagem de fundo

const HomeScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [correctCount, setCorrectCount] = useState(0); // Para contar acertos
  const [incorrectCount, setIncorrectCount] = useState(0); // Para contar erros

  const handleStartGame = async () => {
    if (playerName.trim()) {
      try {
        // Enviando uma solicitação para registrar o jogador e inicializar a pontuação
        const response = await axios.put(`http://192.168.1.106:3000/pontuacoes/${playerName}`, {
          acertos: correctCount,
          erros: incorrectCount,
        });

        // Verifique se a resposta foi bem-sucedida
        if (response.status === 200) {
          console.log('Jogador registrado com sucesso:', response.data);
          // Navegando para a tela do jogo
          navigation.navigate('Game', { playerName, correctCount, incorrectCount }); 
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar a pontuação. Tente novamente.');
        }

      } catch (error) {
        console.error('Erro ao atualizar pontuação:', error.response ? error.response.data : error.message);
        Alert.alert('Erro', 'Não foi possível atualizar a pontuação. Verifique sua conexão e tente novamente.');
      }
    } else {
      Alert.alert('Atenção', 'Por favor, insira seu nome!');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Jogo de Adivinhação de Pokémon!</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#fff"
          value={playerName}
          onChangeText={setPlayerName}
        />
        <Button
          title="Iniciar Jogo"
          onPress={handleStartGame}
          color="#FF6347"
        />
      </View>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',
    color: '#fff',
  },
});

export default HomeScreen;