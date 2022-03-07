import React from 'react';
import { TapGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import Animated, { useSharedValue, Easing, useAnimatedStyle, withTiming, withSpring, withRepeat, useAnimatedGestureHandler } from 'react-native-reanimated';


export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* <ScrollView> */}
      <ScharedValues />
      <Box />
      <WoobleExample />
      <EventExample />
      {/* </ScrollView> */}
    </View>
  );
};

function ScharedValues() {
  const randonWidth = useSharedValue(10);

  const myStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(randonWidth.value, { duration: 500, easing: Easing.bezier(0.5, 0.01, 0, 1) }),
    }
  })

  return (
    <>
      <Text>shared value</Text>
      <Animated.View style={[{ height: 30, backgroundColor: '#4682b4', marginVertical: 3 }, myStyle]} />
      <Button title='toogle' onPress={() => {
        randonWidth.value = Math.random() * 300;
      }}
      />
    </>
  )
};

function Box() {
  const offset = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: offset.value * 300
      }]
    }
  })

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offset.value * 300, {
            damping: 40,
            stiffness: 90
          })
        },
        // {
        //   rotate: withSpring(offset.value * 10)
        // }
      ]
    };
  });

  return (
    <>
      <Text>Default Spring</Text>
      <Animated.View style={[{
        width: 80,
        height: 80,
        backgroundColor: 'purple',
        borderRadius: 20,
        marginVertical: 4
      }, style]}
      />
      <Text>Custom Spring</Text>
      <Animated.View style={[{
        width: 80,
        height: 80,
        backgroundColor: 'purple',
        borderRadius: 20,
        marginVertical: 4
      }, customSpringStyles]}
      />
      <Button title='move' onPress={() => {
        offset.value = withSpring(Math.random())
      }} />
    </>
  )
};

function WoobleExample() {
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }]
    }
  });


  return (
    <>
      <Text>Modifiers</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
        <Animated.View style={[{
          width: 80,
          height: 80,
          backgroundColor: '#f29339',
          borderRadius: 20,
          marginVertical: 4
        }, animatedStyles]}
        />
        <Animated.View style={[{
          width: 80,
          height: 80,
          backgroundColor: 'black',
          borderRadius: 20,
          marginVertical: 4,
        }, animatedStyles]}
        />
        <Animated.View style={[{
          width: 80,
          height: 80,
          backgroundColor: 'pink',
          borderRadius: 20,
          marginVertical: 4
        }, animatedStyles]}
        />
      </View>

      <Button title='wooble' onPress={() => {
        rotation.value = withRepeat(withTiming(40), 6, true)
      }} />
    </>
  )
};

function EventExample() {
  const startPosition = 100;
  const x = useSharedValue(startPosition);
  const y = useSharedValue(startPosition);

  const presed = useSharedValue(false);
  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      presed.value = true;
      ctx.startX = x.value;
      ctx.startY = y.value
    },
    onActive: (event, ctx) => {
      //x.value = startPosition + event.translationX;
      //y.value = startPosition + event.translationY;

      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      presed.value = false;
    }
  });

  const style = useAnimatedStyle(() => {
    return {
      backgroundColor: presed.value ? '#181818' : 'gray',
      transform: [{ scale: withSpring(presed.value ? 1.2 : 1) }]
    }
  })

  return (
    <View style={{
      paddingBottom: 300
    }}
    >
      <Text>Events</Text>
      <TapGestureHandler onGestureEvent={eventHandler}
      >
        <Animated.View style={[{
          width: 40,
          height: 40,
          borderRadius: 20,
          marginVertical: 4,
          marginLeft: 20
        }, style]}
        />
      </TapGestureHandler>
    </View>
  )
};