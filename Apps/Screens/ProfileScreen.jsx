import { View, Text, Image, FlatList } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import diario from './../../assets/images/diario.png'
import buscar from './../../assets/images/buscar.png'
import mundo from './../../assets/images/mundo.png'
import salir from './../../assets/images/salir.png'
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {

  const { user } = useUser();
  const navigation=useNavigation();
  const { isLoaded,signOut } = useAuth();

  const menuList = [
    {
      id: 1,
      name: "Articulos",
      icon: diario,
      path:'my-product'
    },
    {
      id: 2,
      name: "Explorar",
      icon: buscar,
      path:'explorar',
      url:''
    },
    {
      id: 3,
      name: "Link",
      icon: mundo
    },
    {
      id: 4,
      name: "Salir",
      icon: salir
    }

  ]

  const onMenuPress=(item)=>{
    if(item.name=='Salir'){
signOut();
      return
    }

   item?.path? navigation.navigate(item.path):null;
  }
  return (
    <GestureHandlerRootView>

      <View className="p-10 bg-white rounded-[15px]">
        <View className="items-center mt-14">
          <Image
            source={{ uri: user.imageUrl }}
            className="w-[100px] h-[100px] rounded-full"
          />
        </View>
        <View className='items-center'>
          <Text className="font-bold text-[25px] mt-2">{user?.fullName}</Text>
          <Text className="text-[18px] mt-2 text-gray-500">{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
        <FlatList
          data={menuList}
          numColumns={3}
          style={{ marginTop: 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
            onPress={()=>onMenuPress(item)}
            className="flex-1 p-3 border-[1px] items-center mx-2 mt-4 rounded-lg border-blue-400 bg-blue-50"
            >
              {item.icon && <Image source={item?.icon}
                className='w-[70px] h-[70px]' />}
              <Text className='text-[12px] mt-2 text-blue-700'>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

      </View>
    </GestureHandlerRootView>
  )
}
