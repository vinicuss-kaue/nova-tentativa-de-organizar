import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground } from 'react-native';

const backgroundImage = require('./assets/images.jpg');

const HomeScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Jogo de Adivinhação de Pokémon!</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={playerName}
          onChangeText={setPlayerName}
        />
        <Button
          title="Iniciar Jogo"
          onPress={() => navigation.navigate('Game', { playerName })}
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
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
  },
});

export default HomeScreen;