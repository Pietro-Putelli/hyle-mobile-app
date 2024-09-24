// import {isEmpty} from 'lodash';
// import {useEffect, useState} from 'react';
// import {Alert} from 'react-native';
// // import {
// //   SubscriptionPurchase,
// //   getAvailablePurchases,
// //   useIAP,
// // } from 'react-native-iap';

// const SKUS = ['monthly_subscription'];

// const useInAppPurchase = () => {
//   const {
//     subscriptions,
//     getSubscriptions,
//     requestSubscription,
//     finishTransaction,
//     currentPurchaseError,
//   } = useIAP();

//   const [isRestoringPurchase, setIsRestoringPurchase] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (isEmpty(subscriptions)) {
//         await getSubscriptions({skus: SKUS});
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (currentPurchaseError) {
//       console.log(
//         '[useInAppPurchase] currentPurchaseError',
//         currentPurchaseError,
//       );
//     }
//   }, [currentPurchaseError]);

//   const startSubscription = (callback: (isDone: boolean) => void) => {
//     if (isEmpty(subscriptions)) {
//       return;
//     }

//     const sku = subscriptions[0].productId;

//     requestSubscription({
//       sku,
//       andDangerouslyFinishTransactionAutomaticallyIOS: false,
//     })
//       .then((respose: any) => {
//         const purchase = respose as SubscriptionPurchase;

//         const receipt = purchase.transactionReceipt;

//         if (receipt) {
//           /* Upload the receipt on the backend to then perform the validation */
//           finishTransaction({purchase, isConsumable: false});
//         }
//       })
//       .catch(error => {
//         callback(false);
//         console.log('[useInAppPurchase] startSubscription error', error);
//       });
//   };

//   const restorePurchases = async () => {
//     setIsRestoringPurchase(true);

//     try {
//       const availablePurchases = await getAvailablePurchases();

//       if (availablePurchases.length === 0) {
//         setIsRestoringPurchase(false);
//         return;
//       }

//       const purchase = availablePurchases[0];

//       if (purchase) {
//         finishTransaction({purchase});

//         Alert.alert('Success', 'Your purchase has been restored');

//         setIsRestoringPurchase(false);
//       }
//     } catch (error) {
//       setIsRestoringPurchase(false);
//       console.log('[useInAppPurchase] restorePurchases error', error);
//     }
//   };

//   return {
//     subscriptions,
//     isRestoringPurchase,

//     restorePurchases,
//     startSubscription,
//   };
// };

// export default useInAppPurchase;
