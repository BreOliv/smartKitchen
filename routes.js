import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RotaInterna from './rotaInterna';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="rotaInterna">
      <Stack.Screen
        name="rotaInterna"
        component={RotaInterna}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
