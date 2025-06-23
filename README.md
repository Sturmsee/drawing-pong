~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Multiplayer Pong in Canvas by Nils Schiffmann
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This is a simple game of Pong for the Webbrowser.

The APIs used for this application are...

- Canvas API
    - used to draw the Player paddles and the ball

- WebSocket API
    - used for multiplayer functions

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