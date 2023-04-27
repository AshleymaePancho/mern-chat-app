import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import UserBadge from '../userFunctions/UserBadge';
import UserList from '../userFunctions/UserList';
import { AiOutlineEdit } from 'react-icons/ai';
import {
  IconButton,
  Button,
  useDisclosure,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

const EditGroupChat = ({ getMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

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

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User already in the group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      setLoading(true);
      userTokenAuth();
      const { data } = await axios.put(
        `/chat/group-add`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        userTokenAuth()
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      errorStatus();
      setLoading(false);
    }
    setGroupChatName('');
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'Error Occured!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      setLoading(true);
      userTokenAuth();
      const { data } = await axios.put(
        `/chat/group-remove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        userTokenAuth()
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      getMessages();
      setLoading(false);
    } catch (error) {
      errorStatus();
      setLoading(false);
    }
    setGroupChatName('');
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      userTokenAuth();
      const { data } = await axios.put(
        `/chat/group-edit`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        userTokenAuth()
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      errorStatus();
      setRenameLoading(false);
    }
    setGroupChatName('');
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      userTokenAuth();
      const { data } = await axios.get(
        `/user?search=${search}`,
        userTokenAuth()
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      errorStatus();
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<AiOutlineEdit />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={'100%'} display={'flex'} flexWrap={'wrap'} pb={'3'}>
              {selectedChat.users.map((u) => (
                <UserBadge
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={'flex'}>
              <Input
                placeholder="Chat name"
                marginBottom={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={'solid'}
                colorScheme={'blue'}
                marginLeft={'1'}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder={'Add user to group'}
                marginBottom={'1'}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme={'teal'}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditGroupChat;
