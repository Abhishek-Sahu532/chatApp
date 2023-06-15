//THIS CODE BELONGS TO FRONTEND PART

var socket = io(); //comming from the index.html, from the cdn


var userlist = document.getElementById('active_users_list');
var roomlist = document.getElementById('active_rooms_list');
var message = document.getElementById('messageInput');
var sendMessageBtn = document.getElementById('send_message_btn');
var roomInput = document.getElementById('roomInput');
var crateRoom = document.getElementById('room_add_icon_holder');
const chatDisplay = document.getElementById('chat');


var currentRoom = 'globalChat' //default room
var myUsername = '' //default user

//whenever the socket gets connected call this function
socket.on('connect', ()=>{
    myUsername = prompt('Enter name');
    socket.emit('createUser', myUsername); //THE USERNAME WILL RECEIVED BY THE BACKEND
})

// socket.io() // sharing with the backend

//WHEN CLICK THE SEND BUTTON, A EVENT WILL TRANSFER TO THE BACKEND & THE VALUE OF MESSAGE WILL SHARE WITH WITH IT, AND LATER IT SET IT TO AS BLANK
sendMessageBtn.addEventListener('click', ()=>{
    socket.emit('sendMessage', message.value);
    message.value =''
})

socket.on('updateChat', function(username, data){
if(username === 'INFO'){
    console.log('Displaying announcement')
    chatDisplay.innerHTML += `<div class='announcement'> <span>${data}</span> </div>`
} else{
    console.log('Displaying the user message')
    chatDisplay.innerHTML += `<div class="message_holder ${
        username === myUsername ? "me" : ""
      }">
                                  <div class="pic"></div>
                                  <div class="message_box">
                                    <div id="message" class="message">
                                      <span class="message_name">${username}</span>
                                      <span class="message_text">${data}</span>
                                    </div>
                                  </div>
                                </div>`;
};
chatDisplay.scrollTop = chatDisplay.scrollHeight; //scroll at the bottom, new message at bottom;
 



})





function changeRoom(room){
    if(room !== currentRoom){
        socket.emit('updateRooms', room);
        document.getElementById(currentRoom).classList.remove('active_item');
        currentRoom = room;
        document.getElementById(currentRoom).classList.add('active_item')

    }
}