~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Multiplayer Pong in Canvas by Nils Schiffmann
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This is a simple game of Pong for the Webbrowser.

The APIs used for this application are...

- Canvas API
    - used to draw the Player paddles and the ball

- WebSocket API
    - used for multiplayer functions

- Node.JS
    - Server hosting and compiling of files

This whole project is coded with JavaScript and uses HTML and CSS.
Only two players can play the game. Every other person can only watch.



################################
###    The Original Idea     ###
################################

Originaly this project was meant to be a fully drawn game of pong.
In order to hit the ball you had to draw a paddle.
But this paddle would only stay for a few seconds and was limited in length so you couldn't just block of your own side.
While the limitations were fully possible and the players could draw their own paddles each time there were other issues preventing this idea from being fully realized.
Such an issues was the collision detection. Since Canvas has no hitboxes or actual collisions I needed to work around this.
With predetermined shapes it was easy and possible since I could test for their exact shaped size.
But with custom drawings I had no shapes to work with and would have needed to write custom flags and collisions - which I am not able of.

Because of this I made a regular game of Pong. This way I could actually test for collisions and make two player compete against each other.



################################
###     Credits & Notes      ###
################################

This project was made with the aid of Github Copilot.
Copilot was used to cut down writing time, research, help in generating comments and for debugging.

Aside from this the project was created solely by me.



#################################
###     Errors & Mistakes     ###
#################################

While originally the rectangles were meant to move to your mouseCourser -at least the height- there seems to be an error with the assignment of said parameters. The Y-coordinates of the courser get captured and logged but the rectangles still don't seem to react.
#This error has been fixed and and the data can now be synchronized between clients

Also for unknown reasons the program doesn't regocnise the function drawRectangle from the Rect class. This seems to be only the case with the red Rectangle.
The declaration of functions, classes and variables seems correct and the function only gets called at the end when the gameloop is initialized.
#In the newer version of the program this error doesn't appear anymore and it seems to have had something to do with the declarations of the websocket connection and arrangment of initializations.

The message in the beginning of the connection, when the page is first called, is not defined even though it should be since it gets asigned a value to send to the server upon entering the page and establishing the connection.
#This Error is outdated and has been fixed

Because of these errors the game isn't able to load properly and can't be displayed.
However this is just the case for the updated version.

The older version was able to depict and load the game but would soon come to an end because of too many messages send between server and client. To fix this the updated version had some restrictions to the "conversation"

To show these error and mistakes both versions can be looked into in different branches.

After some trial and error I managed to fix an issue with the communication between the clients. To keep the game more or less synchronized the "host" sends the positions of the ball and his own platform to the server and the other player adds his mouse position to the data. Whenever the information gets updated all connected clients receive this data and update the positions of the ball and the platforms on their end. This way everyone sees the same thing and even other clients can watch. 



#################################
###     Potential TO-DOs      ###
#################################

- Adding a room list with several individual games showing the active client count.
    for example: Room 1 - 1/2 Player (0 Spectators)

- Pushing the first spectator as a new player if one of the players disconnect

- Counting the points achieved by each player and setting a maximum of points until round ends

- Adding a round timer so there will be a limit on how long a round lasts for competitive purposes

- Database implementation to allow for creating accounts and customization