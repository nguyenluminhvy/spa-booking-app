import { View, Text, TouchableOpacity } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import RatingScrollView from "@/lib/components/ui/RatingScrollView";

const InfoRow = ({
                   icon,
                   title,
                   subtitle,
                   rightIcon,
                   onPress,
                 }: any) => {
  const isPressable = !!onPress;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        height: 56,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <MaterialCommunityIcons name={icon} size={18} color="#006EE9" />

        <View>
          {subtitle && (
            <Text style={{ color: 'rgba(0,0,0,0.5)' }}>
              {subtitle}
            </Text>
          )}
          <Text>{title}</Text>
        </View>
      </View>

      {rightIcon && (
        <TouchableOpacity
          disabled={!isPressable}
          onPress={onPress}
          hitSlop={10}
        >

          <MaterialCommunityIcons
            name={rightIcon}
            size={18}
            color="rgba(0,0,0,0.5)"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const ServiceAboutView = ({
                     description,
                     reviews,
                     bookingCount = 0,
                     rated = 0,
                     reviewCount = 0,
                     onViewRating,
                   }: any) => {
  const infoItems = [
    {
      icon: 'star',
      subtitle: `RATED ${rated?.toFixed(2) ?? '0.00'}`,
      title: `${reviewCount} Reviews`,
      rightIcon: 'arrow-right-thin-circle-outline',
      onPress: onViewRating,
    },
    {
      icon: 'calendar-multiple-check',
      subtitle: 'Number Of Bookings',
      title: bookingCount,
    },
    {
      icon: 'certificate',
      title: 'Fully Insured and certified',
    },
  ];

  return (
    <View>
      <RatingScrollView data={reviews} />
      <View style={{ paddingHorizontal: 24 }}>
        {infoItems.map((item, index) => (
          <InfoRow key={index} {...item} />
        ))}
      </View>
    </View>
  );
};

export default ServiceAboutView;
