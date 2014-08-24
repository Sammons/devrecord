
The Max Slice Problem:
--

In preparing for interviews I encountered a problem which stopped me dead. After being handed the solution I found that i *still didn't get it*. But after a few minutes of red-lining what little abused grey matter I possess, I began to realize what the intuition is.

**The problem** (forgive the lack of mathematical or otherwise more specific descriptors):

> Given a list of whole numbers (integers), for example `[ 1, 2, -5, 6,
> -3, 4]`, what is the largest sum of a chunk of these numbers? 
> That means if you could grab any subset of these numbers you like, with the
> only rule being that they are all right next to eachother, and the
> goal being to grab the numbers with the largest total possible, then
> how do you do it (in linear time, and constant storage)?

The answer for that set is  7, the result of adding `6, -3, 4` together.

I just oh-so-parenthetically said linear time. That usually means that the problem can be done by just looking over the list a few times. For this algorithm that holds true. I also mentioned constant storage, which means we can do this just by wiggling our fingers and doing math in a fixed amount of short term memory.

Let's get started.
-----

We know we have to add numbers to get a sum, so let's begin with `1`. Sounds good; `1` is now our current best sum. Since we haven't made any silly decisions yet, let's add `2`. Comparing the sum `3` to `1` it is pretty clear that our new  best sum is `3`. 

Enter trouble.

Adding `-5` to `3` grants us `-2`. We compare that to our best sum of `3` and realize we have not found the next best thing, however we should not abandon ship (start counting from 0 again) *yet* since the following number might be seriously awesome, and continue the upward trend.

Enter band-aid.

So we add `6`, and get `4`, which sounds cool, but there is a clear catch. `6` is definitely cooler than `4`. So let's skip starting at `0` and start from `6`. We can already even say that `6` is our new best sum.

Now add `-3` and find `3`, which isn't special compared to `6` but like before we will wait to see if the ship will sail on.

Adding `4` provides us with `7` which is way cool -- `7` is our new sum, and the ship sails on --- oh wait.

*fin:* our result is `7`

How might a JavaScript programmer say this?
---
    
    function maxSlice( arrayOfInts ) {
        var currentBestSum   = arrayOfInts[0];
        var candidateBestSum = arrayOfInts[0];
        for (var i = 1; i < arrayOfInts.length; i++) {
	        /* compare the next sum to the current element alone 
	           this tells us if it is better to reset to the current
	           value instead of carrying on*/
			candidateBestSum = Math.max( 
								arrayOfInts[i], 
								candidateBestSum + arrayOfInts[i]
								);
			/* determine if the current sum is better than
			past ones found*/
			currentBestSum   = Math.max( 
								currentBestSum,
								candidateBestSum 
								);
		}
		return currentBestSum;
    }

Test your mettle on this problem in your language of choice at [codility](https://codility.com/programmers/lessons/7).

Cheers,
Ben





