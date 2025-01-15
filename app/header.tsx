import { Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";



function Header() {
  const [fontsLoaded] = useFonts({
    "ADLaMDisplay": require("../assets/fonts/ADLaMDisplay-Regular.ttf"),
  });
  
  return (
    <>
      <Text style={header.box}>EVENTURE</Text>
    </>
  );
}

export default Header;

const header = StyleSheet.create({
  box: {
    textAlign: 'center',
    padding: 10,
    fontSize: 35,
    fontFamily: 'ADLaMDisplay',
    color: "#4CA19E",
  },
});
