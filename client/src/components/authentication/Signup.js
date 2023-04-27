import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BiHide, BiShow } from 'react-icons/bi';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { VStack } from '@chakra-ui/layout';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/react';

const Signup = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'mern-chat-app');
      data.append('cloud_name', 'dnt1wjwjs');
      fetch('https://api.cloudinary.com/v1_1/dnt1wjwjs/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please delect an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!username || !email || !password || !confirmPass) {
      toast({
        title: 'Please fill all the feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPass) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/user',
        {
          username,
          email,
          password,
          picture,
        },
        config
      );
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push('/chat');
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={'10px'}>
      <FormControl id="registered_username" isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl id="registered_email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="registered_password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button height={'1.75rem'} size={'sm'} onClick={handleClick}>
              {show ? <BiHide /> : <BiShow />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="registered_confirm_password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button height={'1.75rem'} size={'sm'} onClick={handleClick}>
              {show ? <BiHide /> : <BiShow />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="registered_picture">
        <FormLabel>Upload Picture</FormLabel>
        <Input
          type="file"
          padding={'1.5'}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={'100%'}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
