import { Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

function Header() {
  const [fontsLoaded] = useFonts({
    ADLaMDisplay: require("../assets/fonts/ADLaMDisplay-Regular.ttf"),
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
    textAlign: "center",
    padding: 15,
    paddingBottom: 20,
    color: "#4CA19E",
    fontSize: 34,
    fontWeight: "bold",
  },
});
