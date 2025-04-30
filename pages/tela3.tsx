import {StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const alturaStatusBar = StatusBar.currentHeight;
const KEY_GEMINI = "AIzaSyCxpnbCDisIk-6ypTxzTDLI58wVG0776J4";

const genAI = new GoogleGenerativeAI(KEY_GEMINI);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

export default function Viagem() {
  const [load, setLoad] = useState(false);
  const [viagem, setViagem] = useState("");
  const [tituloViagem, setTituloViagem] = useState("");

  const [tipoViagem, setTipoViagem] = useState("");
  const [estiloHospedagem, setEstiloHospedagem] = useState("");
  const [climaDesejado, setClimaDesejado] = useState("");
  const [orcamento, setOrcamento] = useState("");

  async function gerarRoteiro() {
    if (
      tipoViagem === "" ||
      estiloHospedagem === "" ||
      climaDesejado === "" ||
      orcamento === ""
    ) {
      Alert.alert("Atenção", "Informe todos os dados!", [
        { text: "Beleza!" },
      ]);
      return;
    }
    setViagem("");
    setTituloViagem("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `
    Sugira uma viagem considerando: ${tipoViagem}, ${estiloHospedagem}, ${climaDesejado}, ${orcamento}.
    
    IMPORTANTE:
    - Primeiro escreva o nome da viagem (exemplo: "Roteiro para as Montanhas Geladas"), depois uma quebra de linha (\n).
    - Em seguida, descreva o roteiro de forma detalhada.
    - No final, se possível, adicione um link do YouTube relacionado.
    `;
    
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const resultado = await chatSession.sendMessage(prompt);
      const respostaCompleta = resultado.response.text();

      const linhas = respostaCompleta.split('\n');
      const tituloExtraido = linhas[0];
      const conteudoExtraido = linhas.slice(1).join('\n');
      
      setTituloViagem(tituloExtraido);
      setViagem(conteudoExtraido);

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível gerar o roteiro.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="#F1F1F1"
      />
      <Text style={ESTILOS.header}>Planejador de Viagens</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Informe os detalhes da sua viagem:</Text>
        <TextInput
          placeholder="Tipo de viagem (ex: praia, montanha)"
          style={ESTILOS.input}
          value={tipoViagem}
          onChangeText={setTipoViagem}
        />
        <TextInput
          placeholder="Estilo de hospedagem (ex: hotel, hostel)"
          style={ESTILOS.input}
          value={estiloHospedagem}
          onChangeText={setEstiloHospedagem}
        />
        <TextInput
          placeholder="Clima desejado (ex: quente, frio)"
          style={ESTILOS.input}
          value={climaDesejado}
          onChangeText={setClimaDesejado}
        />
        <TextInput
          placeholder="Orçamento estimado"
          style={ESTILOS.input}
          value={orcamento}
          onChangeText={setOrcamento}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarRoteiro}>
        <Text style={ESTILOS.buttonText}>Gerar roteiro</Text>
        <MaterialCommunityIcons name="airplane" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
        style={ESTILOS.containerScroll}
        showsVerticalScrollIndicator={false}
      >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Criando seu roteiro...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {viagem && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.receitaTitulo}>{tituloViagem}</Text>
            <Text style={ESTILOS.receitaTexto}>{viagem}</Text>
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