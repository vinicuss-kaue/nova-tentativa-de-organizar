import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ImageBackground } from 'react-native';

// Importar a imagem local
const backgroundImage = require('./assets/images.jpg'); // Caminho para a imagem de fundo

const HomeScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = () => {
    if (playerName.trim()) {
      navigation.navigate('Game', { playerName });
    } else {
      alert('Por favor, insira seu nome!');
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
    color: '#000', // Ajusta a cor do texto para garantir visibilidade no fundo
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
    color: '#fff', // Cor do texto
  },
});

export default HomeScreen;