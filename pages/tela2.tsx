import {StyleSheet,Text,View,TextInput,TouchableOpacity,Platform,StatusBar,ScrollView,ActivityIndicator,Alert,Keyboard,} from "react-native";
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

export default function Historia() {
  const [load, setLoad] = useState(false);
  const [historias, sethistorias] = useState("");
  const [tituloHistorias, setTituloHistorias] = useState("");

  const [personagem1, setpersonagem1] = useState("");
  const [local1, setlocal1] = useState("");
  const [objeto1, setobjeto1] = useState("");
  const [tema, settema] = useState("");

  async function gerarHistoria() {
    if (
      personagem1 === "" ||
      local1 === "" ||
      objeto1 === "" ||
      tema === "" 
    ){
      Alert.alert("Atenção", "Informe todos os ingredientes!", [
        { text: "Beleza!" },
      ]);
      return;
    }
    sethistorias("");
    setTituloHistorias("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt =  `
    Crie uma história curta utilizando os seguintes elementos: ${personagem1}, ${local1}, ${objeto1}, ${tema}.
    
    IMPORTANTE:
    - Primeiro escreva o título da história (exemplo: "O Mistério do Relógio Perdido"), depois uma quebra de linha (\n).
    - Em seguida, escreva a história completa em tom leve e criativo.
    - No final, se possível, adicione um link do YouTube relacionado.
    `;

    try {
        const sessaoChat = model.startChat({
          generationConfig,
          history: [],
        });
        
        const resultado = await sessaoChat.sendMessage(prompt);
        const respostaCompleta = resultado.response.text();
  

        const linhas = respostaCompleta.split('\n');
        const tituloExtraido = linhas[0];
        const conteudoExtraido = linhas.slice(1).join('\n');
        
        setTituloHistorias(tituloExtraido);
        sethistorias(conteudoExtraido);
  
  
        const result = await sessaoChat.sendMessage(prompt);
        sethistorias(result.response.text());
      } catch (error) {
        console.error(error);
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
      <Text style={ESTILOS.header}>História prática:</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira as informações abaixo:</Text>
        <TextInput
          placeholder="Personagem 1"
          style={ESTILOS.input}
          value={personagem1}
          onChangeText={(texto) => setpersonagem1(texto)}
        />
        <TextInput
          placeholder="Local 1"
          style={ESTILOS.input}
          value={local1}
          onChangeText={(texto) => setlocal1(texto)}
        />
        <TextInput
          placeholder="Objeto 1"
          style={ESTILOS.input}
          value={objeto1}
          onChangeText={(texto) => setobjeto1(texto)}
        />
        <TextInput
          placeholder="Tema"
          style={ESTILOS.input}
          value={tema}
          onChangeText={(texto) => settema(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarHistoria}>
        <Text style={ESTILOS.buttonText}>Gerar história</Text>
        <MaterialCommunityIcons name="book" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
        style={ESTILOS.containerScroll}
        showsVerticalScrollIndicator={false}
      >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Produzindo a história...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {historias && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.receitaTitulo}>{tituloHistorias}</Text>
            <Text style={ESTILOS.receitaTexto}>{historias}</Text>
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
