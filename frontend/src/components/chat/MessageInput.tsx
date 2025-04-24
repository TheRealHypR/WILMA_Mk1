import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  onSendMessage: (messageText: string) => void;
  disabled?: boolean; // Optional: Deaktivieren, während die AI antwortet
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  console.log("MessageInput rendering. onSendMessage type:", typeof onSendMessage, "Disabled:", disabled);
  const [messageText, setMessageText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleSend = () => {
    console.log("MessageInput: handleSend called. Text:", messageText, "Disabled:", disabled);
    if (messageText.trim() && !disabled) {
      try {
        console.log("MessageInput: Attempting to call onSendMessage...");
        onSendMessage(messageText.trim());
        console.log("MessageInput: onSendMessage call finished.");
      } catch (error) {
        console.error("MessageInput: Error calling onSendMessage prop:", error);
      }
      setMessageText(''); // Eingabefeld leeren
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    console.log("MessageInput: handleKeyPress called. Key:", event.key);
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Nachricht eingeben..."
        value={messageText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        multiline // Erlaubt mehrzeilige Eingabe (Shift+Enter)
        maxRows={4} // Begrenzt die maximale Höhe
        sx={{ mr: 1 }} // Abstand zum Button
      />
      <IconButton color="primary" onClick={handleSend} disabled={disabled || !messageText.trim()}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput; 