import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import type { StaffContext } from "@/types/auth";
import { staffWelcomeStyles } from "./StaffWelcome.styles";

type Props = { staff: StaffContext };

export function StaffWelcome({ staff }: Props) {
  const { t } = useTranslation();
  const venueName = staff.venueName ?? staff.venueId;
  const message = t("staff.welcomeMessage", {
    name: staff.displayName,
    venueName,
  });

  return (
    <View style={staffWelcomeStyles.container}>
      <Text style={staffWelcomeStyles.message}>{message}</Text>
    </View>
  );
}
