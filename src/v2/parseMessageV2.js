function safeParseJson(data){
  try {
    return JSON.parse(data);
  } catch(ex){
    throw new Error('Message cannot parse');
  }
}

const parseMessageV2 = callback => (event) => {
  const { data } = event;
  const { message } = data;

  const context = message.data
    ? Buffer.from(message.data, 'base64').toString()
    : null;

  const parsedMessage = safeParseJson(context);

  return callback(parsedMessage, event);
};

module.exports = parseMessageV2;
