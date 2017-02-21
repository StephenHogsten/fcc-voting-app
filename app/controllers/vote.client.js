'use strict';

var vote = {}
vote.addNewOption = function(selection) {
  // console.log('adding options')
  var label = selection.append('div')
    .classed('form-check', true)
    .append('label')
      .classed('form-check-label', true);
  label.append('input')
    .classed('form-check-input', true)
    .attr('required', 'true')
    .attr('type', 'radio')
    .attr('name', 'vote-idx')
    .attr('id', (d,i) => 'vote' + i)
    .attr('value', (d,i) => i);
  label.append('span').text((d) => d.optionText);
};

vote.switchOptions = function(isOldOn) {
  d3.select('#old-form')
    .classed('hidden-input', isOldOn);
  d3.select('#new-form')
    .classed('hidden-input', !isOldOn);
}

function populate() {
  var pollId = window.location.pathname.split('/')[2];    //  /poll/:id
  document.cookie = 'lastPoll=' + pollId;
  // add hidden id field to both
  var form = d3.selectAll('form').append('input')
      .attr('type', 'text')
      .attr('value', pollId)
      .attr('name', 'id')
      .classed('hidden-input', true);
  userHandler.ajaxJson('/api/poll/' + pollId, (json) => {
    // console.log(json);
    d3.selectAll('.poll-title').text(json.title);
    d3.selectAll('.poll-desc').text(json.description);
    // add votes for all the existing options
    var options = d3.select('.vote-option-holder').selectAll('.option')
      .data(json.votes);
    vote.addNewOption(options.enter());
  });
  userHandler.ajaxJson('/api/is_logged_in', (json) => {
    if (json.loggedIn) {
      d3.select('.top-bar').append('a')
        .attr('href', '/logout')
        .append('div')
          .attr('class', 'top-bar-box login-box')
          .text('Logout');
      // add button to use a new voting option
      d3.select('#old-form').insert('button', 'button')
        .attr('type', 'button')
        .attr('id', 'vote-alt')
        .classed('btn btn-info', true)
        .attr('id', 'form-new-voting-option')
        .on('click', () => vote.switchOptions(true))
        .text('Add New Voting Option');
      d3.select('#back-to-old').on('click', () => vote.switchOptions(false));
    } else {
      var newDiv = d3.select('.top-bar').append('a')
        .attr('href', '/auth/github')
        .append("div").classed('top-bar-box login-box', true);
      newDiv.append('img').attr('src', '/public/img/gh-mark-32px.png');
      newDiv.append('span').text('Login');
    }
    d3.select('.top-bar').append('a')
      .attr('href', '/')
      .append('div')
        .classed('top-bar-box', true)
        .text('Return Home');
    
  });
}