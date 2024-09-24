// import CloseIcon from '@/assets/icons/CloseIcon.svg';
// import RightArrowIcon from '@/assets/icons/RightArrowIcon.svg';
// import {FadeAnimatedView} from '@/components/Animations';
// import {IconButton, MainButton, TitleButton} from '@/components/Buttons';
// import MainText from '@/components/MainText';
// // import useInAppPurchase from '@/hooks/useInAppPurchase';
// import {useNavigation} from '@react-navigation/native';
// import {LinearGradient} from 'expo-linear-gradient';
// import React from 'react';
// import {Image, StatusBar, View} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import styles from './styles';

// const FEATURES = [
//   {
//     title: 'AI Assistant',
//     description: 'Get personalized insights for keywords and trends.',
//   },
//   {
//     title: 'Advanced Search',
//     description:
//       "Easily find what you're looking for with advanced search filters.",
//   },
//   {
//     title: 'Unlimited Storage',
//     description:
//       'Never worry about running out of space with unlimited storage for all your notes.',
//   },
// ];

// const Paywall = () => {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();

//   const {
//     subscriptions,
//     isRestoringPurchase,

//     startSubscription,
//     restorePurchases,
//   } = useInAppPurchase();

//   const onDonePress = () => {
//     startSubscription(() => {});
//   };

//   const onRestorePress = () => restorePurchases();

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           backgroundColor: '#060606',
//           paddingBottom: insets.bottom + 16,
//         },
//       ]}>
//       <StatusBar barStyle="light-content" />

//       <View style={styles.pictureContainer}>
//         <Image
//           style={styles.bgImage}
//           source={require('@/assets/pictures/login9.jpg')}
//         />

//         <LinearGradient
//           colors={['transparent', 'rgba(6,6,6,0.8)', 'rgba(6,6,6,1)']}
//           style={styles.gradient}>
//           <View style={[styles.header, {paddingTop: insets.top}]}>
//             <TitleButton
//               isHaptic
//               isLoading={isRestoringPurchase}
//               onPress={onRestorePress}>
//               Restore
//             </TitleButton>

//             <IconButton
//               forceDarkTheme
//               icon={CloseIcon}
//               onPress={() => {
//                 navigation.goBack();
//               }}
//             />
//           </View>

//           <View style={{flex: 1}}></View>

//           <FadeAnimatedView
//             style={{
//               paddingHorizontal: 20,
//             }}
//             mode="fade">
//             <MainText weight="bold" style={{marginBottom: 8}} size={32}>
//               Panta Pro
//             </MainText>

//             {FEATURES.map((feature, index) => (
//               <View key={index} style={{paddingVertical: 12, gap: 8}}>
//                 <MainText color="#fff" size={20} underline weight="semiBold">
//                   {feature.title}
//                 </MainText>

//                 <MainText
//                   color="#fff"
//                   weight="semiBold"
//                   style={{marginLeft: 2}}
//                   size={14}>
//                   {feature.description}
//                 </MainText>
//               </View>
//             ))}

//             <View style={{marginTop: 24}}>
//               <MainText weight="bold" color="#fff" size={26}>
//                 {subscriptions[0]?.localizedPrice}
//                 <MainText uppercase size={12} color="#fff">
//                   {' '}
//                   / month
//                 </MainText>
//               </MainText>
//             </View>
//           </FadeAnimatedView>
//         </LinearGradient>
//       </View>

//       <View style={{paddingHorizontal: 16}}>
//         <MainButton
//           isHaptic
//           type="primary"
//           title="start trial"
//           rightIcon={RightArrowIcon}
//           style={{marginTop: 8}}
//           activeScale={0.96}
//           onPress={onDonePress}
//         />

//         <View style={{paddingHorizontal: 12}}>
//           <MainText
//             align="center"
//             size={12}
//             color={'#ffffff50'}
//             style={{textAlign: 'center', marginTop: 16}}>
//             Auto renew after trial. Cancel anytime.
//           </MainText>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Paywall;
