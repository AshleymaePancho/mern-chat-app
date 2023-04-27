import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogic';
import ChatLoading from './ChatLoading';
import GroupChat from './miscellaneous/GroupChat';
import { BsPlusCircle } from 'react-icons/bs';
import { useToast, Box, Stack, Text, Button } from '@chakra-ui/react';

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/chat', config);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      width={{ base: '100%', md: '31%' }}
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection={'column'}
      alignItems={'center'}
      background={'white'}
      borderRadius={'lg'}
      padding={'3'}
    >
      <Box
        width={'100%'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        padding={'3'}
      >
        <GroupChat>
          <Button
            display={'flex'}
            marginLeft={'auto'}
            fontSize={{ base: '15px', md: '13px' }}
            leftIcon={<BsPlusCircle size={'18'} />}
          >
            Group Chat
          </Button>
        </GroupChat>
      </Box>
      <Box
        width={'100%'}
        height={'100%'}
        display={'flex'}
        flexDirection={'column'}
        padding={'3'}
        overflowY={'hidden'}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={'pointer'}
                background={selectedChat === chat ? 'blue.300' : 'gray.50'}
                color={selectedChat === chat ? 'white' : 'black'}
                padding={'3'}
                borderRadius={'lg'}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
