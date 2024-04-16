import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import ExploreScreen from '../Screens/ExploreScreen';
import AddPostScreen from '../Screens/AddPostScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import HomeScreenStackNav from './HomeScreenStackNav';
import ProfileScreenStackNav from './ProfileScreenStackNav';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
  <Tab.Navigator screenOptions={{
    headerShown:false
  }}>
<Tab.Screen name='Inicio-nav' component={HomeScreenStackNav}
options={{
  tabBarLabel:({color})=>(
    <Text style={{color:color,fontSize:12,marginBottom:3}}>Inicio</Text>
  ),tabBarIcon:({color,size})=>(
    <Entypo name="home" size={size} color={color} /> 
  )
}} />
<Tab.Screen name='Explorar' component={ExploreScreen}
options={{
  tabBarLabel:({color})=>(
    <Text style={{color:color,fontSize:12,marginBottom:3}}>Explorar</Text>
  ),tabBarIcon:({color,size})=>(
    <Feather name="search" size={size} color={color} />
  )
}}/>
<Tab.Screen name='Publicar' component={AddPostScreen}
options={{
  tabBarLabel:({color})=>(
    <Text style={{color:color,fontSize:12,marginBottom:3}}>Publicar</Text>
  ),tabBarIcon:({color,size})=>(
    <MaterialIcons name="post-add" size={size} color={color} />
  )
}}/>
<Tab.Screen name='Perfil' component={ProfileScreenStackNav}
options={{
  tabBarLabel:({color})=>(
    <Text style={{color:color,fontSize:12,marginBottom:3}}>Perfil</Text>
  ),tabBarIcon:({color,size})=>(
    <Ionicons name="person" size={size} color={color} />
  )
}}/>
  </Tab.Navigator>
  )
}