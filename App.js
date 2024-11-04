import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, Pressable, Linking} from 'react-native';
import { Picker } from '@react-native-picker/picker'

export default function App() {
  const [adatok, setAdatok] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState();

  const letoltes = async (nyelv) => {
    const x = await fetch(`https://newsapi.org/v2/top-headlines?country=${nyelv}&apiKey=3896d67f06394c548239d21610ab6841`)
    const y = await x.json()

    setAdatok(y)
  }

  useEffect(() => {
    letoltes("us")
  }, [])

  const Item = ({cim, kep_url, leiras, tartalom, datum, forras}) => (
    <View style={styles.hir}>
      <Image style={styles.kep} source={{uri: `${kep_url}`}}/>
      <Text style={styles.cim}>{cim}</Text>
      <Text style={styles.leiras}>{leiras}</Text>
      <Text style={styles.tartalom}>{tartalom}</Text>
      <Text style={styles.datum}>{datum.split('T')[0]} {datum.split('T')[1].split('Z')[0]}</Text>
      <Text style={styles.forras}>{forras}</Text>
      <Pressable onPress={() => Linking.openURL(forras)} style={styles.gomb}><Text style={{fontSize: 20, textAlign: 'center'}}>Olvass tovább</Text></Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Picker
        style={{backgroundColor: 'white', width: '100%'}}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) =>
          {setSelectedLanguage(itemValue); letoltes(itemValue)}
        }>
        <Picker.Item label="Amerika" value="us" />
        <Picker.Item label="Magyar" value="hu" />
      </Picker>
      <FlatList
        data={adatok.articles}
        renderItem={({item}) => <Item cim={item.title} kep_url={item.urlToImage} leiras={item.description} tartalom={item.content} datum={item.publishedAt} forras={item.url}/>}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(20,20,65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  kep: {
    width: 200,
    height: 200,
    marginHorizontal: 'auto',
  },
  hir: {
    borderBottomWidth: 5,
    borderBottomColor: 'white',
    padding: 20,
  },
  cim: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
  },
  leiras: {
    textAlign: 'justify',
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
    paddingBottom: 10,
  },
  tartalom: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(240,240,255,0.45)',
  },
  datum: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginVertical: 10,
  },
  forras: {
    fontSize: 12,
    fontWeight: '400',
    color: 'goldenrod',
  },
  gomb: {
    backgroundColor: 'goldenrod',
    width: '50%',
    margin: 'auto',
    marginTop: 10,
    padding: 10,
  }
});
