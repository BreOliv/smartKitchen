import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const alturaStatusBar = StatusBar.currentHeight;
const CHAVE_GEMINI = "AIzaSyCxpnbCDisIk-6ypTxzTDLI58wVG0776J4";

const gemini = new GoogleGenerativeAI(CHAVE_GEMINI);

const modelo = gemini.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const configuracoesGeracao = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

export default function TelaCardapio() {
  const [tituloReceita, setTituloReceita] = useState("");
  const [dieta, setDieta] = useState("");
  const [numPessoas, setNumPessoas] = useState("");
  const [restricoes, setRestricoes] = useState("");
  const [cardapio, setCardapio] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function gerarCardapio() {
    if (dieta === "" || numPessoas === "" || restricoes === "") {
      Alert.alert("Atenção", "Preencha todos os campos para gerar o cardápio.", [{ text: "Beleza!" }]);
      return;
    }

    setCardapio("");
    setTituloReceita("");
    setCarregando(true);
    Keyboard.dismiss();

    const prompt = `Crie um cardápio semanal para ${numPessoas} pessoas, com dieta ${dieta}, e levando em consideração as restrições alimentares: ${restricoes}.
    
     FORMATO DE RESPOSTA:
    Título da receita na primeira linha.
    Em seguida, o modo de preparo separado em parágrafos.`;


    try {
      const sessaoChat = modelo.startChat({
        generationConfig: configuracoesGeracao,
        history: [],
      });

      const resultado = await sessaoChat.sendMessage(prompt);
      const respostaCompleta = resultado.response.text();

      const linhas = respostaCompleta.split('\n');
      const tituloExtraido = linhas[0];
      const conteudoExtraido = linhas.slice(1).join('\n');
      
      setTituloReceita(tituloExtraido);
      setCardapio(conteudoExtraido);

      setCardapio(respostaCompleta);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível gerar o cardápio. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={ESTILOS.header}>Cardápio Semanal</Text>

      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Preencha as informações:</Text>

        <TextInput
          placeholder="Tipo de dieta (ex: vegana, low carb)"
          style={ESTILOS.input}
          value={dieta}
          onChangeText={setDieta}
        />
        <TextInput
          placeholder="Número de pessoas"
          style={ESTILOS.input}
          keyboardType="numeric"
          value={numPessoas}
          onChangeText={setNumPessoas}
        />
        <TextInput
          placeholder="Restrições alimentares (ex: sem glúten)"
          style={ESTILOS.input}
          value={restricoes}
          onChangeText={setRestricoes}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarCardapio}>
        <Text style={ESTILOS.buttonText}>Gerar Cardápio</Text>
        <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
        style={ESTILOS.containerScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {carregando && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Gerando o cardápio...</Text>
            <ActivityIndicator color="blue" size="large" />
          </View>
        )}

        {cardapio !== "" && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.titulo}>Cardápio Gerado:</Text>
            <Text style={ESTILOS.receitaTitulo}>{tituloReceita}</Text>
            <Text style={ESTILOS.receitaTexto}>{cardapio}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const ESTILOS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    paddingTop: Platform.OS === "android" ? alturaStatusBar : 54,
  },
  form: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#94a3b8",
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "blue",
    width: "90%",
    borderRadius: 8,
    flexDirection: "row",
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  content: {
    backgroundColor: "#FFF",
    padding: 16,
    width: "100%",
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
  },
  containerScroll: {
    width: "90%",
    marginTop: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'darkblue',
    marginBottom: 16,
  },
  receitaTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'darkblue',
    marginBottom: 16,
  },
  receitaTexto: {
    fontSize: 16,
    lineHeight: 24,
  },
});
