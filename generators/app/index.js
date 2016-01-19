'use strict';

var process = require('process');
var newLine = process.env == 'win32' ? '\r\n' : '\n';
var fs = require('fs');

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var removeMarkdown = require('remove-markdown');
var async = require('async');

var services = require('./services');
var codewars = new services.CodewarsService();

var kyuColors = {
    '-8': chalk.white,
    '-7': chalk.white,
    '-6': chalk.yellow,
    '-5': chalk.yellow,
    '-4': chalk.blue.dim,
    '-3': chalk.blue.dim,
    '-2': chalk.magenta.dim,
    '-1': chalk.magenta.dim,
    '1': chalk.white.dim,
    '2': chalk.white.dim,
    '3': chalk.white.dim,
    '4': chalk.white.dim,
    '5': chalk.red,
    '6': chalk.red,
    '7': chalk.red,
    '8': chalk.red,
};

var maxDescriptionLimit = 120;

module.exports = yeoman.generators.Base.extend({

    getKataDetails: function() {
        var done = this.async();
        var that = this;
        this.prompt({
            name: 'kataName',
            message: 'Enter the ID or slug of the kata',
            validate: function(val) {
                if (!val) {
                    return 'Please enter a valid slug or ID.'; 
                }
                return true;
            }
        }, function(props) {
            codewars.getKata(props.kataName, function(err, kata) {
                if (err) {
                    return done(err);
                }
                if (!kata) {
                    return done('No such kata was found');
                }
                if (kata.languages.indexOf('javascript') < 0) {
                    return done('Sorry, this kata does not support JavaScript');
                }

                var text = removeMarkdown(kata.description);
                kata.plainDescription = text;
                kata.shortDescription = text.length <= maxDescriptionLimit ? text : (text.substring(0, maxDescriptionLimit) + '...');
                
                that.props = props || {};
                that.props.kata = kata;
                done();
            });
        });
    },

    confirmKata: function() {
        var kata = this.props.kata;
        var done = this.async();
        var message = 'Is this what you\'re looking for?' + newLine;
        message += (kyuColors[kata.rank.id] || chalk.white)('<' + kata.rank.name + '> ') + kata.name + ' - ' + kata.url;
        message += newLine + kata.shortDescription;

        this.prompt({
            type: 'confirm',
            name: 'confirmKata',
            message: message
        }, function(props) {
            done();
        })
    },

    checkFiles: function() {
        var that = this;
        var done = this.async();

        that.props.files = [
            { from: this.templatePath('solution.js'), to: this.destinationPath('src/' + that.props.kata.slug + '.js') },
            { from: this.templatePath('test.js'), to: this.destinationPath('test/' + that.props.kata.slug + '.js') }
        ];

        var checks = that.props.files.map(function(file, idx) {
            return function(callback) {
                return fs.stat(file.to, function(err, stats) {
                    if (err) {
                        // no other file exists on the destination path
                        if (err.code == 'ENOENT') {
                            return callback();
                        }
                        return callback(err);
                    }
                    
                    var promptName = 'confirmFileExists' + idx;
                    that.prompt({
                        type: 'confirm',
                        name: promptName,
                        message: 'Another file exists on path ' + file.to + ', would you like to overwrite it?',
                    }, function(props) {
                        if (!props[promptName]) {
                            callback('You have chosen not to overwrite one of the files, operation will be cancelled.');
                        } else {
                            callback();
                        }
                    });
                });
            };
        });

        async.waterfall(checks, done);
    },

    generateTemplates: function() {
        var that = this;
        var props = this.props;
        props.files.forEach(function(file) {
            that.fs.copyTpl(file.from, file.to, props);
        });
        this.log('All done! Feel free to run ' + chalk.cyan.bold('mocha --grep ' + props.kata.id) + ' to test your solution!');
    }
});
