import { View, type ViewProps } from "react-native";
import { styles } from "./index.styles";

type ScreenContainerProps = ViewProps & {
  /** Optional: disable horizontal padding (e.g. for full-bleed content). */
  noPadding?: boolean;
};

export function ScreenContainer({
  style,
  noPadding,
  children,
  ...rest
}: ScreenContainerProps) {
  return (
    <View style={[styles.outer, style]} {...rest}>
      <View style={[styles.inner, noPadding && { paddingHorizontal: 0 }]}>
        {children}
      </View>
    </View>
  );
}
