import React, { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogic';
import EditGroupChat from './miscellaneous/EditGroupChat';
import Profile from './miscellaneous/Profile';
import ScrollChat from './ScrollChat';
import { BiLeftArrow } from 'react-icons/bi';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const ChatFunction = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();

  function userTokenAuth() {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    return config;
  }

  function errorStatus() {
    return toast({
      title: 'Error Occured!',
      description: this.error.response.data.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    });
  }

  const getMessages = async () => {
    if (!selectedChat) return;
    try {
      userTokenAuth();
      setLoading(true);
      const { data } = await axios.get(
        `/message/${selectedChat._id}`,
        userTokenAuth()
      );
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      errorStatus();
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      try {
        userTokenAuth();
        setNewMessage('');
        const { data } = await axios.post(
          '/message',
          {
            content: newMessage,
            chatId: selectedChat,
          },
          userTokenAuth()
        );
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        errorStatus();
      }
    }
  };

  useEffect(() => {
    socket = socketIO(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const generalDisplayStyle = {
    width: '100%',
    display: 'flex',
    padding: '3',
  };

  const spinnerStyle = {
    size: 'xl',
    width: '20',
    height: '20',
    alignSelf: 'center',
    margin: 'auto',
  };

  const chatboxStyle = {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            sx={generalDisplayStyle}
            justifyContent={{ base: 'space-between' }}
            alignItems={'center'}
            fontSize={{ base: '28px', md: '30px' }}
            fontFamily={'lora'}
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<BiLeftArrow />}
              onClick={() => setSelectedChat('')}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <Profile user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName}
                  <EditGroupChat
                    getMessages={getMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            sx={generalDisplayStyle}
            height="100%"
            justifyContent={'flex-end'}
            flexDirection={'column'}
            background={'gray.100'}
            borderRadius={'lg'}
            overflowY={'hidden'}
          >
            {loading ? (
              <Spinner sx={spinnerStyle} />
            ) : (
              <Box sx={chatboxStyle}>
                {loading ? (
                  <Spinner sx={spinnerStyle} />
                ) : (
                  <Box sx={chatboxStyle}>
                    <ScrollChat messages={messages} />
                  </Box>
                )}
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired marginTop={'3'}>
              <Input
                variant={'outline'}
                background={'gray.300'}
                placeholder={'Enter a message..'}
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          height={'100%'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Text fontSize={'3xl'} pb={'3'} fontFamily={'lora'}>
            Click on anyone to start chatting!
          </Text>
        </Box>
      )}
    </>
  );
};

export default ChatFunction;
