import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons/";
import TelaCardapio from "./pages/tela1";
import Historia from "./pages/tela2";
import Viagem from "./pages/tela3";
import TelaInicial from "./pages/App";
import React from "react";

const Tab = createBottomTabNavigator();

export default function RotaInterna() {
  return (
    <Tab.Navigator
    initialRouteName="App"
      screenOptions={{
        tabBarActiveBackgroundColor: "#F0E68C",
        tabBarStyle: {
          position: "absolute",
          height: 60,
          bottom: 30,
          right: 30,
          left: 30,
          borderRadius: 5,
          backgroundColor: "#FFD700",
        },
      }}
    >
      <Tab.Screen
        name="App"
        component={TelaInicial}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={focused ? 25 : 20}
              color={"#000"}
              name={focused ? "pizza" : "pizza-outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="tela1"
        component={TelaCardapio}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={focused ? 25 : 20}
              color={"#000"}
              name={focused ? "home" : "home-outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="tela2"
        component={Historia}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={focused ? 25 : 20}
              color={"#000"}
              name={focused ? "grid" : "grid-outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="tela3"
        component={Viagem}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={focused ? 25 : 20}
              color={"#000"}
              name={focused ? "airplane" : "airplane-outline"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
