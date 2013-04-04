# Chat with JSON

In this assignment, you'll build a chat client and connect it to other students.  You'll do this by using `$.ajax` to send and fetch JSON data with a remote server.

The remote server is Parse.  They've documented their REST api [here](https://www.parse.com/docs/rest#general).  Please note that you will only need a small part of it.  On that page, immediately below "Quick Reference", there is a heading named "Objects" followed by several other headings.  You definitely won't need to refer to any of the headers that follow until "Request Format".

Parse is a general system, and will allow you to create any kind of object you'd like.  If you'd like to send chats to other students, use urls like `/1/classes/messages` and send data with the following format:

```javascript
var message = {
  username: "shawndrost",
  text: "trololo",
  roomname: "4chan", // optional; used in an extra credit option below
  hax: "alert('hi')" // optional; used in an extra credit option below
}
```

If you'd like to experiment, please use urls like `/1/classes/mytest1234`

```javascript
$.ajax("https://api.parse.com/1/classes/messages", {
  beforeSend: headerSetter,
  contentType: "application/json",
  success: function(data){
    $("#main").append(data.results.username);
    console.log(data)
  }
});
```

You should:
  * Allow users to select a username and send messages.

Extra credit
  * Allow other chat users to send real javascript in the 'hax' field. `eval` the js others send you.  Enjoy ensuing chaos.
  * Allow users to create rooms, and enter existing rooms.
  * Refactor your app to use backbone.
