import Lottie from "lottie-react-native";
import React from "react";
import { View, Text } from "react-native";

const NoDataFoundComponent = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 50}}>
      <Lottie
      style={{width: "90%", height: "100%"}}
        source={require("~/resources/animations/no_data_found.json")}
        autoPlay
        loop
      />
    </View>
  );
};

export default NoDataFoundComponent;
