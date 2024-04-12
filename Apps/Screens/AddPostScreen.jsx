import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { app } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  addDoc,
} from "firebase/firestore";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";
import moment, { isDate } from "moment";

export default function AddPostScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    getCategoryList();
  }, []);

  /**ver categoria */
  const getCategoryList = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    const categories = [];
    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      categories.push(doc.data()); // Aquí invocamos doc.data() en lugar de doc.data
    });
    setCategoryList(categories); // Luego asignamos la lista completa al estado
  };
  /**se usa para acceder imagennes de la galeria */
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async (value) => {
    setLoading(true);
    /**covertir uri a archivo blob */
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, "post/" + Date.now() + ".jpg");

    uploadBytes(storageRef, blob)
      .then(async (snapshot) => {
        console.log("Uploaded a blob or file!");
        const downloadURL = await getDownloadURL(storageRef);
        console.log(downloadURL);
        value.image = downloadURL;
        value.userName = user.fullName;
        value.userEmail = user.primaryEmailAddress.emailAddress;
        value.userImage = user.imageUrl;

        const docRef = await addDoc(collection(db, "UserPost"), value);
        if (docRef.id) {
          setLoading(false);
          Alert.alert("Exito!!", "Publicacion Agregada");
        }
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
      });
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView className="p-12">
        <Text className="text-[27px] font-bold">Añadir Articulo</Text>
        <Text className="text-[16px] text-gray-500 mb-7">
          Crear Nueva Publicacion e iniciar Trueque
        </Text>
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            address: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            useImage: "",
            createdAt: moment().format('D MMM YYYY')
          }}
          onSubmit={(value) => onSubmitMethod(value)}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              console.log("Title not present");
              ToastAndroid.show("Title Must be There", ToastAndroid.SHORT);
              errors.title = "Title must be there";
            }
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
          }) => (
            <View>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 125, height: 125, borderRadius: 15 }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/imagen.png")}
                    style={{ width: 125, height: 125, borderRadius: 15 }}
                  />
                )}
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Titulo"
                value={values?.title}
                onChangeText={handleChange("title")} // Cambiado de onChange a onChangeText
              />
              <TextInput
                style={styles.input}
                placeholder="Descripcion"
                value={values?.desc}
                onChangeText={handleChange("desc")}
                numberOfLines={5}
              />
              <TextInput
                style={styles.input}
                placeholder="Precio"
                value={values?.price}
                keyboardType="number-pad"
                onChangeText={handleChange("price")}
              />
              <TextInput
                style={styles.input}
                placeholder="Direccion"
                value={values?.address}
                onChangeText={handleChange("address")}
              />
              {/**categoria lista */}
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
                <Picker
                  selectedValue={values?.category}
                  className="border-2"
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                >
                  {categoryList.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item?.name}
                      value={item?.name}
                    />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: loading ? "#ccc" : "#007BFF",
                }}
                disabled={loading}
                className="p-4 bg-blue-500 rounded-full mt-10"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center text-[16px]">
                    Registrar
                  </Text>
                )}
              </TouchableOpacity>
              {/** <Button onPress={handleSubmit} className="mt-7" title="submit" />*/}
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 17,
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    textAlignVertical: "top",
    paddingTop: 15,
  },
});
