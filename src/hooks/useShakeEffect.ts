// import {useEffect, useRef} from 'react';
// import {Accelerometer} from 'expo-sensors';
// import * as Haptic from 'expo-haptics';

// const useShakeEffect = (callback: () => void, isHaptic?: boolean) => {
//   const isShaking = useRef(false);

//   const triggerHaptic = () => {
//     Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
//   };

//   useEffect(() => {
//     Accelerometer.setUpdateInterval(100);

//     Accelerometer.addListener(({x, y, z}) => {
//       const acceleration = Math.sqrt(x * x + y * y + z * z);

//       const sensibility = 3;

//       if (!isShaking.current && acceleration >= sensibility) {
//         isShaking.current = true;

//         setTimeout(() => {
//           callback();

//           if (isHaptic) {
//             triggerHaptic();
//           }

//           isShaking.current = false;
//         }, 100);
//       }
//     });

//     return () => {
//       Accelerometer.removeAllListeners();
//     };
//   }, []);

//   const onShakeEnd = () => {
//     isShaking.current = false;
//   };

//   return {
//     onShakeEnd,
//   };
// };

// export default useShakeEffect;
