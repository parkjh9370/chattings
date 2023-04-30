const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// global socket handler
socket.on('user_connected', (username) => {
  drawNewChattingMessage(`${username} 님이 입장하셨습니다.`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChattingMessage(`${username}: ${chat}`);
});

socket.on('disconnect_user', (username) =>
  drawNewChattingMessage(`${username}님이 퇴장하셨습니다.`),
);

// event callback function
const handleSubmit = (event) => {
  event.preventDefault();
  const chattingMessageValue = event.target.elements[0].value;
  if (chattingMessageValue !== '') {
    socket.emit('submit_chat', chattingMessageValue);
  }
  drawNewChattingMessage(`${chattingMessageValue}`, true);
  event.target.elements[0].value = '';
};

// draw function
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `랜덤 채팅방에 입장 하셨습니다 :)`);

const drawNewChattingMessage = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;

  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('닉네임 설정');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}

init();
