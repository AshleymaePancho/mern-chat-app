import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
} from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: 'flex' }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.username}
                placement={'bottom-start'}
                hasArrow
              >
                <Avatar
                  marginTop={'7px'}
                  marginRight={'1'}
                  size={'sm'}
                  cursor={'pointer'}
                  name={m.sender.username}
                  src={m.sender.picture}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? '#BEE3F8' : '#b5e7eb'
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameSender(messages, m, i, user._id) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollChat;
