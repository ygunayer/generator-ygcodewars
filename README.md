# generator-ygcodewars
An extremely simplistic [Yeoman](http://yeoman.io) generator for Codewars kata solutions.

## Installation
First, install [Yeoman](http://yeoman.io) and generator-ygcodewars using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-ygcodewars
```

If you wish to build and install the project manually, simply run the following commands:

```bash
npm install
```

```bash
npm link
```

## Running
Use the following command to run the generator

```bash
yo ygcodewars
```

The generator will first ask for a kata slug or ID, and then query the Codewars API with the given value. If a kata with that slug or ID does exists and it supports Javascript, a hollow file for both the source and test of the solution will be created under the `src/` and `test/` folders respectively (using the templates at [generators/app/templates/solution.js](generators/app/templates/solution.js) and [generators/app/templates/test.js](generators/app/templates/test.js)).

Once the files are generated, it's up to you to implement the solution and its tests. See [ygunayer/codewars-example-project](https://github.com/codewars-example-project) for an example project structure, and feel free to fork the repo and build your own work over it.

## What's Missing
Since the project is written quite hastily it lacks tests and has suboptimal code quality, so I kept the feature set as limited as possible to prevent any unexpected behavior. Also, it is implied (but not verified) that when running the generator, the directory you're working under is in fact the root folder of a Node.js project that has `mocha` and `chai` among its dependencies, and that `mocha` is also installed globally (even though it's not technically necessary).

To summarize, we need to:
- Implement tests
- Improve code quality
- Verify the current working folder (or quite possibly, scaffold the project when required)

## License
MIT
