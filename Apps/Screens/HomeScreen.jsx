import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import Header from "../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import { getFirestore, collection, getDocs, orderBy } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import Categories from "../Components/HomeScreen/Categories";
import LatestItemList from "../Components/HomeScreen/LatestItemList";
import moment from 'moment';


export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false); 
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList,setLatestItemList ] = useState([]);
  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      getSliders(),
      getCategoryList(),
    ]);
    await getLatestItemList(); // Llama a getLatestItemList directamente
    setRefreshing(false);
  };

  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    querySnapshot.forEach((doc) => {
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };
/**acceder a categorias */
  const getCategoryList = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push(doc.data());
    });
    setCategoryList(categories);
  };
/**acceder a posts */
const getLatestItemList = async () => {
  try {
    setLatestItemList([]);
    const querySnapshot = await getDocs(collection(db, "UserPost"));
    const items = [];
    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      // Convertir la fecha al formato de marca de tiempo
      const createdAtTimestamp = moment(itemData.createdAt, 'D MMM YYYY').valueOf();
      items.push({ ...itemData, createdAtTimestamp });
    });
    // Ordenar los elementos por fecha de creación en orden descendente
    items.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
    // Actualizar el estado con los elementos ordenados
    setLatestItemList(items);
  } catch (error) {
    console.error('Error al obtener la lista de elementos más recientes:', error);
  }
};


  return (
    <ScrollView className="py-10 px-6 bg-white flex-1"
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Agrega RefreshControl al ScrollView
  
    >
      <Header />
      <Slider sliderList={sliderList} />
      {/**categorias */}
      <Categories categoryList={categoryList} />
      {/** */}
      <LatestItemList latestItemList={latestItemList}
      heading={'Lo Ultimo'}/>
    </ScrollView>
  );
}
