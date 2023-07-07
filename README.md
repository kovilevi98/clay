# Letter Connect

Letter Connect is a novel game invented by the almighty engineers at Clay to pass time while their code is compiling.

The game is played by 2 players and the rules are the following:



1. The board is filled with a random number of A/B/C letters (note: letters can repeat but there can be no letter other than A, B, or C).
2. The goal of the game is to connect letters together with lines, so at every turn, the player has to connect a letter with another letter on the board. There are a few constraints, however:
    - Two letters of the same kind cannot be connected to each other (i.e. A->A is not valid)
    - Each letter can be connected with up to 2 other letters
    - A letter cannot be connected to two letters of the same type (i.e. B&lt;-A->B is not valid)
3. Every time a player runs out of moves they lose 💀.

Very simple game example (with just 3 different letters):


1 Initial board: 
```
A  B  C
```

2 First player turn (connects A->B):
```
A->B  C
```

3 Second player turn (connects B->C):
```
A->B->C
```

4 First player turn (connects A->C):
```
A->B->C
|-----|
```

5 The first player wins because there are no moves left for the second player to do.

This was, however, a very simple board and our engineers often start their games with very complex boards with several As, Bs, and Cs (like `A A A B B C` or `A A A C C C`), therefore things can get pretty complicated quite quickly. 

---

As an applicant to Clay, it would be very kind if you could help us create the endpoints for the server that allows our engineers to play this game. In particular, you will be asked to create:

1. An endpoint for creating a new game
2. An endpoint for adding a move (which will validate if the move is valid)
3. An endpoint to return the current game (computing if there is any winner)

We understand that you are not applying for a backend position and we are simply interested in seeing how you will approach this problem (don’t worry about DevOps/scaling - the simplest HTTP development server on a single thread will be just fine). The reason why we ask you to write a simple server instead of a CLI program is that we want to see how you approach a problem in a more realistic environment.

What we really care about is that you think about all the edge cases of the game and write software that will allow us to smoothly play it.

# Rules for the Application

Inside this repo, you will find an [OpenAPI](https://swagger.io/specification/) spec that contains the endpoints that you have to implement.

You are free to open it in an editor to get back pretty-printed docs and/or to use it to create the server boilerplate and facilitate a bit of your work. In any case, as long as the endpoints respect the specs, you won’t receive any penalty by using or not OpenAPI/Swagger codegen. Take your time to read the specs carefully, as not all the constraints that are written there are automatically handled by the codegen (but you will have to handle them!)

Please put all of your code in the (now) empty directory `letterconnect_server`, also inside this repo.

Inside the same folder, also put a README.md file that contains enough information to manually run the server on a localhost installation (http over a random port is ok) on MacOS.

All of your code must be implemented using one of the following languages (frameworks):

-   Dart (shelf)
-   Javascript (node)
-   Kotlin (ktor)
-   Swift (perfect)
-   Python (flask)

What we are considering for the evaluation:

1. The implementation respects the specs
2. The code is robust (it handles edge cases and it doesn’t crash)
3. The code is clean, easy to read, and documented where needed
4. The code is fast enough (we will put a generous timeout of 30 seconds for each request)

Please keep things simple:

1. The requests won’t run in parallel, and we will perform them one by one.
2. Only one instance of the server will run, and we will keep it alive until all the tests run. This means that a simple memory persistence is more than enough to get the job done (no extra points for more complex implementations).
3. We expect the server to ignore extra fields inside the request body and not to reject the whole request itself.
4. Our client will also ignore extra fields coming from the server and only parse the one it expects.
5. For requests that should error, we will just validate the return status code (4xx).
6. The only exception to the above point is in the `/games/{id}/move` endpoint, for which we expect in return a strict json body for the two specific cases detailed in the specs.
