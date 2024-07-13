import {
  ColorValue,
  Dimensions,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import React, { useCallback, useImperativeHandle, useRef } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useColorScheme } from "~/lib/useColorScheme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children }, ref) => {
    const translateY = useRef(useSharedValue(0));
    const animatedValue = useRef(useSharedValue(0));
    const disabled = useRef(useSharedValue(true));

    const { colorScheme } = useColorScheme();

    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      "worklet";
      active.value = destination !== 0;
      animatedValue.current.value = 10;
      translateY.current.value = withTiming(destination, {
        duration: 300,
      });
      disabled.current.value = true;
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.current.value };
      })
      .onUpdate((event) => {
        if (disabled.current.value) {
          return;
        }
        translateY.current.value = event.translationY + context.value.y;
        translateY.current.value = Math.max(
          translateY.current.value,
          MAX_TRANSLATE_Y
        );
      })
      .onEnd(() => {
        if (disabled.current.value) {
          return;
        }
        if (translateY.current.value > -SCREEN_HEIGHT * 0.75) {
          scrollTo(0);
          animatedValue.current.value = 0;
        } else if (translateY.current.value < -SCREEN_HEIGHT / 1.5) {
          scrollTo(-SCREEN_HEIGHT * 0.75);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.current.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolate.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.current.value }],
      };
    });

    const sheetContainerStyles = useAnimatedStyle(() => {
      return {
        backgroundColor:
          colorScheme === "dark" ? "rgba(255,255,2550.1)" : "rgba(0,0,0,0.4)",
        opacity: active.value ? withTiming(1) : 0,
      };
    }, [colorScheme]);

    const pointerEvents = useAnimatedProps<ViewProps>(
      () => ({
        pointerEvents: active.value ? "auto" : "none",
      }),
      []
    );

    return (
      <>
        <Animated.View
          onTouchStart={() => {
            scrollTo(0);
          }}
          style={[StyleSheet.absoluteFillObject, sheetContainerStyles]}
          animatedProps={pointerEvents}
        />
        <GestureDetector gesture={gesture}>
          <Animated.View
            className=" bg-background"
            style={[styles.bottomSheetContainer, rBottomSheetStyle]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => {
                disabled.current.value = false;
              }}
              style={styles.sheetTop}
            >
              <View style={[styles.line]} className="bg-foreground" />
            </TouchableOpacity>

            {children}
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 20,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    borderRadius: 2,
  },
  sheetTop: {
    paddingVertical: 15,
    alignItems: "center",
  },
});
