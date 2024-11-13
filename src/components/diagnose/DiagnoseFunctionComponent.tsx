import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAppTheme } from "~/resources/theme";

type DiagnoseFunctionComponentParam = {
  title: string;
  buttonTitle: string;
  onPress: () => void;
  image?: any;
  content: string;
  imageWidth?: number;
  imageHeight?: number;
};

const DiagnoseFunctionComponent = ({
  title = "What is that",
  buttonTitle = "Click me",
  onPress,
  image = null,
  content,
  imageWidth = NaN,
  imageHeight = NaN,
}: DiagnoseFunctionComponentParam) => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  return (
    <View
      style={[styles.container, { borderColor: theme.colors.primary }]}
    >
      <View style={[styles.leftContainer]}>
        <Text style={[styles.textTitle]} numberOfLines={2}>{title}</Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 14,
            textAlign: "left",
            lineHeight: 16,
            color: "#000000",
          }}
          numberOfLines={3}
        >
          {t(content)}
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.buttonText]}>{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.rightContainer]}>
        <Image
          style={[
            styles.imageStyle,
            !Number.isNaN(imageWidth) && { width: imageWidth },
            !Number.isNaN(imageHeight) && { height: imageHeight },
          ]}
          source={image ?? require("~/resources/images/home/treeDiagnose.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // paddingRight: 11,
    paddingLeft: 12,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 210,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
    gap: 10
  },
  leftContainer: {
    // paddingTop: 26,
    // paddingBottom: 35,
    justifyContent: "space-between",
    // width: 130,
    flex: 0.50,
    gap: 11,
  },
  rightContainer: {
    height: "100%",
    flex: 0.50,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  imageStyle: {
    overflow: "hidden",
    aspectRatio: 178/194,
    height: 170,
    // width: 178,
  },
  textTitle: {
    fontSize: 20,
    color: "#4B6D4E",
    lineHeight: 28,
    textAlign: "left",
    fontWeight: "700",
    // textOverflow: "ellipsis",
    // whiteSpace: "nowrap",
  },
  button: {
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 5
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default DiagnoseFunctionComponent;
