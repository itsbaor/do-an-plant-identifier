import { H3 } from "./Typography.tsx";
import React, { ComponentProps, memo, useMemo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { RadioButton as DefaultRadioButton } from "react-native-paper";

// import { Paragraph } from '~/base/Typography';

type SelectorProps = {
  value: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
  color?: string;
  state?: boolean;
  onPress?: (value: string) => void;
} & Omit<
  ComponentProps<typeof DefaultRadioButton.Android>,
  "value" | "onValueChange"
>;

const RadioButton = memo(
  ({ value, label, color, style, onPress, state, ...props }: SelectorProps) => {
    const onTouchablePress = () => {
      onPress?.(value);
    };

    const customStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.itemContainer, style],
      [style]
    );

    return (
      <Pressable onPress={onTouchablePress} style={customStyle}>
        <DefaultRadioButton.Android
          value={value}
          color={color ? color : "#6949FF"}
          uncheckedColor={color ? color : "#6949FF"}
          status={state === true ? "checked" : "unchecked"}
          onPress={onTouchablePress}
          {...props}
        />
        <H3 style={styles.tag}>{label}</H3>
      </Pressable>
    );
  }
);
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  tag: {
    alignItems: "center",
    maxWidth: "75%",
    paddingTop: 4,
    paddingLeft: 4,
  },
});
export default RadioButton;
