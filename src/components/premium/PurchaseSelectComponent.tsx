import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import RadioButton from '../base/RadioButton';
import {useAppTheme} from '~/resources/theme';
import IconStarTag from '~/resources/icons/premium/IconStarTag';

export const enum PURCHASE {
  WEEKLY = 'weekly',
  YEARLY = 'yearly',
  NONE = 'none',
}

type PurchaseChoice = {
  content: string;
  tagContent?: string;
  tagStartIcon?: boolean;
  info?: string;
  puchaseType: PURCHASE;
  selectedPurchase?: PURCHASE;
  onSelectPurchase: () => void;
};

const PurchaseSelectComponent = ({
  content,
  tagContent,
  tagStartIcon = false,
  onSelectPurchase,
  info,
  puchaseType,
  selectedPurchase,
}: PurchaseChoice) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        puchaseType === selectedPurchase
          ? {
              backgroundColor: theme.colors.bg_box_selected_gray,
              borderColor: theme.colors.primary,
              borderWidth: 2,
            }
          : {
              backgroundColor: theme.colors.bg_box_unselected_gray,
              borderColor: theme.colors.border_unselected_gray,
              borderWidth: 2,
            },
      ]}
      onPress={onSelectPurchase}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: theme.colors.primary,
          right: 0,
          top: 0,
          borderBottomLeftRadius: 8,
          borderTopRightRadius: 3.5,
          paddingVertical: 2,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 2,
          paddingHorizontal: 6,
          alignItems: 'center',
        }}>
        {tagStartIcon && <IconStarTag />}
        <Text
          style={{
            color: theme.colors.text_white,
            fontWeight: '600',
            fontSize: 10,
            lineHeight: 17,
          }}>
          {tagContent}
        </Text>
      </View>
      <View
        style={[styles.radioButton, {}]}>
        <RadioButton
          value={selectedPurchase as string}
          state={puchaseType === selectedPurchase ? true : false}
          color={theme.colors.primary}
          onPress={onSelectPurchase}
        />
      </View>
      <View
        style={{
          flex: 1,
          minHeight: 80,
          justifyContent: 'flex-end',
          paddingBottom: 5
        }}>
        <Text
          style={{
            color: theme.colors.text_white,
            fontWeight: '600',
            fontSize: 20,
            lineHeight: 24,
          }}
          numberOfLines={1}>
          {content}
        </Text>
        <Text
          style={{
            color: theme.colors.text_white,
            fontWeight: '400',
            fontSize: 13,
            lineHeight: 24,
          }}>
          {info}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 70,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    position: 'relative',
    // paddingTop: 12,
  },
  iconText: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
  },
});

export default PurchaseSelectComponent;
