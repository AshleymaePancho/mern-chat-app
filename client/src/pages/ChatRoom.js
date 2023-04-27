import { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import ChatNavBar from '../components/miscellaneous/ChatNavBar';
import MyChats from '../components/MyChats';
import Chatbox from '../components/Chatbox';
import { Box } from '@chakra-ui/layout';

const ChatRoom = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {user && <ChatNavBar />}
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        width={'100%'}
        height={'90.5vh'}
        padding={'10px'}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatRoom;
