import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { Entypo } from '@expo/vector-icons';


export default function ItemList() {
    const { params } = useRoute();
    const db = getFirestore(app)
    const [itemList, setItemList] = useState([])
    useEffect(() => {
        params && getItemListByCategory();
    }, [params])

    const getItemListByCategory = async () => {
        setItemList([]);
        const q = query(collection(db, 'UserPost'), where('category', '==', params.Category));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            console.log(doc.data());
            setItemList(itemList => [...itemList, doc.data()]);
        })

    }
    return (
        <View className='p-2'>
            {itemList?.length > 0 ? <LatestItemList latestItemList={itemList}
                heading={''} /> : <View className='flex items-center justify-center '>
                <Text className='p-5 text-[20px] justify-center text-center text-gray-400 mt-24'>
                    No hay Publicaciones
                </Text>
                <Entypo name="emoji-sad" size={300} color="gray"  />
            </View>}
        </View>

    )
}