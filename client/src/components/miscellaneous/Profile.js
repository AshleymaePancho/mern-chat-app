import React from 'react';
import { FaRegEye } from 'react-icons/fa';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from '@chakra-ui/react';

const Profile = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: 'flex' }} icon={<FaRegEye />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={'300px'}>
          <ModalHeader
            display={'flex'}
            justifyContent={'center'}
            fontSize={'30px'}
            fontFamily={'lora'}
            fontStyle={'italic'}
          >
            {user.username}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
          >
            <Image
              borderRadius="full"
              marginTop={'-20px'}
              boxSize="150px"
              src={user.picture}
              alt={user.username}
            />
            <Text fontSize={'18px'} margin={'15px 0'}>
              {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;
