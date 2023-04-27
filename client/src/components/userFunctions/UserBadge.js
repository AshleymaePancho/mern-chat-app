import { Badge } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';

const UserBadge = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      paddingX={'2'}
      paddingY={'1'}
      borderRadius={'lg'}
      margin={'1'}
      marginBottom={'2'}
      variant={'subtle'}
      colorScheme={'linkedin'}
      cursor={'pointer'}
      onClick={handleFunction}
      letterSpacing={'1px'}
    >
      <Text fontWeight={'normal'}>
        {user.username}
        {admin === user._id && <span> (Admin)</span>}
      </Text>
    </Badge>
  );
};

export default UserBadge;
