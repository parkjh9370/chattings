const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// global socket handler
socket.on('user_connected', (username) => {
  drawNewChattingMessage(`${username} conntected!`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChattingMessage(`${username}: ${chat}`);
});

// event callback function
const handleSubmit = (event) => {
  event.preventDefault();
  const chattingMessageValue = event.target.elements[0].value;
  if (chattingMessageValue !== '') {
    socket.emit('submit_chat', chattingMessageValue);
  }
  drawNewChattingMessage(`me: ${chattingMessageValue}`);
  event.target.elements[0].value = '';
};

// draw function
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);

const drawNewChattingMessage = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
    <div>
      ${message}
    </div>
  `;

  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}

init();
