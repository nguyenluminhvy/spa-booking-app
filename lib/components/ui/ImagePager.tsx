import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import {IMAGES} from "@/lib/assets/images";

const { width } = Dimensions.get("window");

const images = [
  IMAGES.banner_1,
  IMAGES.banner_2,
  IMAGES.banner_3,
  IMAGES.banner_4,
];

export default function ImagePager() {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = index + 1;

      if (nextIndex >= images.length) {
        nextIndex = 0;
      }

      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });

      setIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [index]);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setIndex(slideIndex);
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {images.map((img, i) => (
          <Image key={i} source={img} style={styles.image} />
        ))}
      </ScrollView>

      {/* DOT */}
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 200,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
});
