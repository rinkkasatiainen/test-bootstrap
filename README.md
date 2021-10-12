# Test Bootstrap   

This is a project set up to start practicing (unit) testing in TypeScript.
 
## Exercise Lift pass Pricing

Originally from [Johan Martinsson](https://github.com/martinsson/Refactoring-Kata-Lift-Pass-Pricing)

### Think, in groups, how would you start refactoring this

Note, you might need to do the first steps without having automated tests. 
What could be the smallest possible change that would make the code testable.

In the [Tips](https://github.com/martinsson/Refactoring-Kata-Lift-Pass-Pricing#tips) Johan suggests 
starting with HTTP layer tests, but it would require running a DB and if that is not possible,
the first refactoring needs to be done without help of tests.

Once the code is unit testable, cover it with tests, and start the fun part - refactoring.

### Refactor code

There are two ways to go to refactoring - starting from the _shape of the solution domain_ (outside) 
or from the small details. Try either one, and try to focus on the **readability** of the code

When refactoring, try an approach called 'Ship of Theseus' (formerly known as Strangler Fig)
 * [ ] identify one branch, make a guard clause 
   * then introduce and object, 
   * send messages based on the 'night' or 'day' ticket type
 * [ ] once a branches is covered (you might double check with ```nyc``), remove the branch.
 * [ ] do the same with other types of objects.