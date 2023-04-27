import axios from 'axios';
import React, { useState } from 'react';
import { Effect } from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge';
import Profile from './Profile';
import ChatLoading from '../ChatLoading';
import UserList from '../userFunctions/UserList';
import { getSender } from '../../config/ChatLogic';
import { ChatState } from '../../context/ChatProvider';
import { FiSearch } from 'react-icons/fi';
import { BiBell } from 'react-icons/bi';
import { Tooltip } from '@chakra-ui/tooltip';
import { Button } from '@chakra-ui/button';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Text } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { Input } from '@chakra-ui/input';
import { useToast } from '@chakra-ui/toast';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/menu';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Spinner,
} from '@chakra-ui/react';

const ChatNavBar = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please input username or email',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  return (
    <div style={{ width: '100%' }}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        background={'white'}
        width={'100%'}
        padding={'5px 10px 5px 10px'}
        borderWidth={'5px'}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant={'ghost'} onClick={onOpen}>
            <FiSearch size={'20'} />
            <Text display={{ base: 'none', md: 'flex' }} padding={'4'}>
              Search user
            </Text>
          </Button>
        </Tooltip>
        <div>
          <Menu>
            <MenuButton as={Button} variant={'ghost'} marginRight={'2'}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BiBell size={'30'} />
            </MenuButton>
            <MenuList padding={'3'}>
              {!notification.length && 'No New Messages'}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<AiOutlineCaretDown />}>
              <Avatar
                size={'sm'}
                cursor={'pointer'}
                name={user.username}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      {/*  */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={'1px'}>Search users</DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} paddingBottom={'2'}>
              <Input
                placeholder="Input name or email"
                marginBottom={2}
                value={search}
                marginRight={'5px'}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <FiSearch size={'20'} />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ChatNavBar;
