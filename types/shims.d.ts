declare module 'react-native' {
  // Lightweight shims for common react-native exports used in the project.
  export const View: any;
  export const Text: any;
  export const StyleSheet: any;
  export const Image: any;
  export const ScrollView: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const Alert: any;
  export const Dimensions: any;
  export const Platform: any;
  export const StatusBar: any;
  export default any;
}

declare module 'lucide-react-native' {
  export const MapPin: any;
  export const Star: any;
  export const Users: any;
  export const Calendar: any;
  export const Phone: any;
  export const MessageCircle: any;
  export const ArrowLeft: any;
  export const Clock: any;
  export const CheckCircle: any;
  export const TrendingUp: any;
  export const Heart: any;
}

declare module 'expo-router' {
  export const router: any;
  export function useLocalSearchParams<T = any>(): T;
  export function useRouter(): any;
}

declare module 'react-i18next' {
  export function useTranslation(): { t: (key: string, params?: any) => string };
}

declare module 'i18next' {
  const i18n: any;
  export default i18n;
}
