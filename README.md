# Test Bootstrap   

This is a project set up to start practicing (unit) testing in TypeScript.

It has 2 common test 

## Exercise: Racing Car katas

This is originally from [Emily Bache](https://github.com/emilybache/Racing-Car-Katas).

Note: when working on this codebase. Think that the public interfaces of the objects are used by 
hundreds of clients. So, it's better not to change the interface, otherwise there will be a lot 
of refactoring involved.

### Unit test for ```tire-pressure-monitoring-system/alarm.ts``` class

 * [ ] Figure out what makes this class hard-to-test
 * [ ] Then extract the 'easy-to-test' parts from the 'hard-to-test' parts
   * Make a safe refactoring. How small can it be?
 * [ ] Test the easy-to-test part

### Unit test for ```turn-ticket-dispenser/dispenser.ts``` class

 * [ ] Figure out what makes this class hard-to-test
 * [ ] Then extract the 'easy-to-test' parts from the 'hard-to-test' parts
   * Make a safe refactoring. How small can it be?
 * [ ] Test the easy-to-test part

### Unit test for ```text-converter/html-text-converter.ts``` class

* [ ] ```fs#readFileSync``` actually reads a file. How to unit test a  function that reads a file (and does something to the content)
* [ ] extract a function that does take a parameter of either
  * a function that returns a file content (and in prod code would use ```fs```)
  * string representation of file
  * a reader of sort (an object that responds to a message ```read``` or something)
* [ ] Test the easy-to-test code.

### Unit test for ```telemetry-system/telemetry-client-controls.ts``` class

