import { View, Text, Image, TouchableOpacity, Linking, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler';
import { EvilIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';


export default function ProductDetail({ navigation }) {
  const { params } = useRoute();
  const [product, setProduct] = useState([]);
  const { user } = useUser();
  const db = getFirestore(app);
  const nav=useNavigation();
  useEffect(() => {
    params && setProduct(params.product);
    shareButton();

  }, [params, navigation])
  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (

        <EvilIcons name="share-google" size={40} color="white"
          style={{ marginRight: 15 }}
          onPress={() => shareProduct()} />
      ),
    });
  }
  /**compartir Producto  */
  const shareProduct = async () => {
    const content = {
      message: product?.title + "\n" + product?.desc,
    }
    Share.share(content).then(resp => {
      console.log(resp);
    }, (error) => {
      console.log(error);
    })
  }
  const sendEmailMessage = () => {
    const subject = 'Sobre ' + product.title;
    const body = 'Hola ' + product.userName + '\n' + 'Estoy Interesado en este Articulo'
    Linking.openURL('mailto:' + product.userEmail + "?subject=" + subject + "&body=" + body);

  }

  const deleteUserPost = () => {
    Alert.alert('quieres borrar?', "quieres borrar esta publicacion?", [
      {
        text: 'si',
        onPress: () => deleteFromFirebase()
      }, {

        text: 'no',
        onPress: () => console.log('cancelado presionado'),
        style: 'cancel'

      }

    ])
  }
  const deleteFromFirebase = async () => {
    console.log('Intentando borrar...');
    try {
        const q = query(collection(db, 'UserPost'), where('title', '==', product.title));
        const snapshot = await getDocs(q);
        console.log('Documentos encontrados:', snapshot.size);
        
        if (snapshot.size === 0) {
            console.warn('No se encontraron documentos para borrar.');
            return;
        }

        const promises = snapshot.docs.map(doc => {
            console.log('Borrando documento:', doc.id);
            return deleteDoc(doc.ref);
        });

        await Promise.all(promises);
        console.log('Documentos borrados exitosamente.');
        nav.goBack();
    } catch (error) {
        console.error('Error al intentar borrar documentos:', error);
    }
}

  return (
    <ScrollView className='bg-white'>
      <Image source={{ uri: product.image }}
        className='h-[320px] w-full' />
      <View className='p-3'>
        <Text className='text-[20px] font-bold'>{product.title}</Text>
        <View className='items-baseline ' >
          <Text className='p-2 mt-2 px-2 rounded-full bg-blue-200 text-blue-500'>{product.category}</Text>
        </View>
        <Text className='mt-3 font-bold text-[20px]'>Descripcion</Text>
        <Text className='text-[17px] text-gray-500'>{product.desc}</Text>
      </View>
      {/**User Info */}
      <View className='p-3 flex flex-row items-center gap-3 border-[1px] bg-blue-100 border-blue-300'>
        <Image source={{ uri: product.userImage }}
          className='w-12 h-12 rounded-full' />

        <View >
          <Text className='font-bold text-[18px]'>{product.userName}</Text>
          <Text className='text-gray-500'>{product.userEmail}</Text>
        </View>
      </View>

      {user?.primaryEmailAddress.emailAddress == product.userEmail ?

        <TouchableOpacity className='z-40 bg-red-500 rounded-full  p-4 m-5 '
          onPress={() => deleteUserPost()}>
          <Text className='text-center text-white'>Borrar</Text>
        </TouchableOpacity> :
        <TouchableOpacity className='z-40 bg-blue-500 rounded-full  p-4 m-5 '
          onPress={() => sendEmailMessage()}>
          <Text className='text-center text-white'>Enviar Mensaje</Text>
        </TouchableOpacity>

      }

    </ScrollView>
  )
}