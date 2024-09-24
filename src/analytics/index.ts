import analytics from '@react-native-firebase/analytics';

class Analytics {
  private static instance: Analytics;

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public trackEvent(eventName: string, eventData: any): void {
    if (!__DEV__) {
      // Handle analytcis event tracking here
    }
  }
}

export default Analytics.getInstance();
