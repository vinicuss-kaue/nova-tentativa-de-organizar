import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import axios from 'axios';

const backgroundImage = require('./assets/download.jpg');

const ResultScreen = ({ route, navigation }) => {
  const { correct, incorrect, playerName } = route.params;
  const [ranking, setRanking] = useState([]);

  const fetchRanking = async () => {
    try {
      const response = await axios.get('http://192.168.1.106:3000/pontuacoes');
      // Ordenar o ranking em ordem decrescente com base nos acertos
      const sortedRanking = response.data.sort((a, b) => b.acertos - a.acertos);
      setRanking(sortedRanking);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Resumo do Jogo</Text>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultText}>Acertos: {correct}</Text>
          <Text style={styles.resultText}>Erros: {incorrect}</Text>
        </View>
        
        <Text style={styles.title}>Ranking dos Jogadores</Text>
        <ScrollView style={styles.scrollContainer}>
          {ranking.map((entry, index) => (
            <Text key={index} style={styles.resultText}>
              {`${index + 1}. ${entry.playerName}: ${entry.acertos} acertos`}
            </Text>
          ))}
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <Button title="Voltar à Tela Inicial" onPress={() => navigation.navigate('Home')} color="#FF6347" />
          <Button title="Jogar Novamente" onPress={() => navigation.navigate('Game', { playerName })} color="#1E90FF" />
        </View>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  resultsContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingVertical: 15,
  },
  resultText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ResultScreen;