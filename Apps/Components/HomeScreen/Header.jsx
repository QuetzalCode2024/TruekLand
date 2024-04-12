import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { AntDesign } from '@expo/vector-icons';

export default function Header() {
  const { user } = useUser();
  return (
    <View>
        {/**informacion de usuario */}
      <View className="flex flex-row items-center gap-2">
        <Image
          source={{ uri: user?.imageUrl }}
          className="rounded-full w-12 h-12"
        />
        <View>
          <Text className="text-[16px]">Bienvenido</Text>
          <Text className="text-[20px] font-bold">{user?.fullName}</Text>
        </View>
      </View>
       {/**barra buscar */}
       <View className="p-[9px] bg-blue-50 rounded-full px-5  flex flex-row items-center  mt-5 border-blue-300 border-[1px]">
       <AntDesign name="search1" size={24} color="gray"  />
        <TextInput placeholder="Buscar" className="ml-2 text-[18px]"
        onChangeText={(value)=>console.log(value)}/>
       </View>
    </View>
   

  );
}
