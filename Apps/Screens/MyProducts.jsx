import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import { useUser } from '@clerk/clerk-expo'
import LatestItemList from '../Components/HomeScreen/LatestItemList'
import { useNavigation } from '@react-navigation/native'

export default function MyProducts() {

  const db = getFirestore(app);
  const { user } = useUser();
  const [productList, setProductList] = useState([]);
  const navigattion=useNavigation();
  useEffect(() => {
    user && getUserPost();
  }, [user])

  useEffect(()=>{

navigattion.addListener('focus',(e)=>{
  getUserPost();
})
  },[navigattion])

  /**se usa para obtener publicaciones del usuario */
  const getUserPost = async () => {
setProductList([]);
    const q = query(collection(db, 'UserPost'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      console.log(doc.data());
      setProductList(productList=>[...productList,doc.data()]);
    })


  }
  return (
    <View>
      <LatestItemList latestItemList={productList}
      
      />
    </View>
  )
}