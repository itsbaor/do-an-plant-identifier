import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import CheckBoxOutline from "./CheckBoxOutline";
import CheckBoxTic from "./CheckBoxTic";

type CheckboxTextParams = {
  text: string;
  onCheck: () => void;
  isChecked?: boolean;
};

const CheckboxText = ({
  text,
  onCheck,
  isChecked = false,
}: CheckboxTextParams) => {
  useEffect(() => {
    return () => {isChecked = false};
  }, []);
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      onPress={onCheck}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      {/* Checkbox icon or component */}
      <View style={{ position: "relative" }}>
        <CheckBoxOutline />
        {isChecked && (
          <View
            style={{
              position: "absolute",
              top: "23%",
              left: "13%",
            }}
          >
            <CheckBoxTic />
          </View>
        )}
      </View>
      <Text
        style={{
          fontFamily: "Inter-Regular",
          marginLeft: 8,
          fontWeight: "700",
          fontSize: 15,
          lineHeight: 18,
          color: "#000000",
        }}
      >
        {t(text)}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckboxText;
