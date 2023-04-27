import React from 'react';
import LoginLogic from '../components/authentication/Login';
import SignupLogic from '../components/authentication/Signup';
import {
  Container,
  Box,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
} from '@chakra-ui/react';

const Homepage = () => {
  return (
    <Container maxWidth={'xl'}>
      <Box
        width={'100%'}
        borderRadius={'2xl'}
        rounded={'3xl'}
        border={'#d8dce0 solid 3px'}
        padding={'2'}
        margin={'5rem 0 3rem 0'}
      >
        <Tabs
          variant="soft-rounded"
          colorScheme="blue"
          background={'white'}
          padding={'4'}
          borderRadius={'2xl'}
        >
          <TabList marginBottom={'1'}>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{<LoginLogic />}</TabPanel>
            <TabPanel>{<SignupLogic />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
