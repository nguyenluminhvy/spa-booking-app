import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StarRow = ({ star, count, percent }: any) => {
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <MaterialCommunityIcons
            key={i}
            name="star"
            size={18}
            color={i < star ? '#FFC107' : 'rgba(0,0,0,0.2)'}
          />
        ))}
      </View>

      <Text style={{width: 28, textAlign: 'right'}}>{count}</Text>

      <Text style={{width: 52, textAlign: 'right', color: 'rgba(0,0,0,0.5)'}}>({percent}%)</Text>
    </View>
  );
};

const RatingOverview = ({ rating = {}}) => {
  const data = rating?.breakdown || []
  const totalReviews = rating?.total || 0
  const average = rating?.average || 0

  return (
    <View style={{ padding: 20 }}>
      <Text>{totalReviews} Reviews</Text>

      <Text style={{ color: 'rgba(0,0,0,0.5)' }}>
        {average.toFixed(2)} out of 5.0
      </Text>

      <View style={{ marginTop: 16, gap: 8 }}>
        {data?.map((item) => (
          <StarRow key={item.star} {...item} />
        ))}
      </View>
    </View>
  );
};

export default RatingOverview;
