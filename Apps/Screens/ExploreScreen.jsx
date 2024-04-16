import { View, Text, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { ScrollView } from 'react-native-gesture-handler';

export default function ExploreScreen() {
  const db = getFirestore(app);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getAllProduct();
  }, [])

  const getAllProduct = async () => {
    setProductList([]);
    const q = query(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setProductList(productList => [...productList, doc.data()]);
    })
  }

  return (
    <View className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
      <ScrollView className="p-6">
        <Text className="text-3xl font-bold">Explore More</Text>
        <LatestItemList latestItemList={productList} />
      </ScrollView>
    </View>
  );
}
