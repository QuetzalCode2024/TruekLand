import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Header from "../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import Categories from "../Components/HomeScreen/Categories";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function HomeScreen() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList,setLatestItemList ] = useState([]);
  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);

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
  setLatestItemList([]);
  const querySnapshot = await getDocs(collection(db, "UserPost"));
  querySnapshot.forEach((doc) => {
    setLatestItemList((prevItems) => [...prevItems, doc.data()]);
  });
};

  return (
    <ScrollView className="py-10 px-6 bg-white flex-1">
      <Header />
      <Slider sliderList={sliderList} />
      {/**categorias */}
      <Categories categoryList={categoryList} />
      {/** */}
      <LatestItemList latestItemList={latestItemList}/>
    </ScrollView>
  );
}
