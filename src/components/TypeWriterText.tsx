import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";

const TypewriterText = ({ text = "", speed = 100, onScrollToEnd = () => {} }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      currentIndex += 1;
      if (currentIndex === text.length) {
        clearInterval(intervalId);
      }
      onScrollToEnd();
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <Text style={styles.text}>{displayedText}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: "#000000",
    textAlign: "left",
    lineHeight: 18
  },
});
export default TypewriterText;
