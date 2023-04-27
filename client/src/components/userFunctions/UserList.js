import { Avatar } from '@chakra-ui/avatar';
import { Box, Text } from '@chakra-ui/layout';

const UserList = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={'pointer'}
      background={'gray.100'}
      _hover={{
        background: 'blue.400',
        color: 'white',
      }}
      width={'100%'}
      display={'flex'}
      color={'black'}
      padding={'3'}
      marginBottom={'2'}
      borderRadius={'lg'}
    >
      <Avatar
        marginRight={'2'}
        size={'md'}
        cursor={'pointer'}
        name={user.username}
        src={user.picture}
      />
      <Box display={'inline-block'}>
        <Text>{user.username}</Text>
        <Text fontSize={'xs'}>
          <em>{user.email}</em>
        </Text>
      </Box>
    </Box>
  );
};

export default UserList;
