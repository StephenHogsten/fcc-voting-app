'use strict'

var userHandler = {};

userHandler.ajaxJson = function(url, cb) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
      cb(JSON.parse(http.response));
    }
  }
  http.open('GET', url);
  http.send('');
};

userHandler.addSinglePoll = function(d) {
  // add in a link to view / edit individual polls
  var thisDiv = d3.select(this).append('a')
    .attr('href', '/poll/' + d['_id'])
    .append('div')
      .attr('class', 'poll row')
      .on('mouseover', (d) => {
        var desc = (d.description)? d.description: '[no description]';
        thisDiv.append('div')
          .attr('class', 'poll-description')
          .text(desc);
      })
      .on('mouseout', () => {
        d3.select('.poll-description').remove()
      })
  thisDiv.append('h3')
    .attr('class', 'poll-title')
    .text((d) => d.title);
  thisDiv.append('div')
    .classed('btn btn-danger', true)
    .classed('hidden-input', (d) => d.owner != window.location.pathname.split('/')[2])
    .text('Delete Poll')
    .on('click', (d) => {
      window.location.pathname = '/api/delete_poll/' + d['_id'];
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });
  thisDiv.append('span')
    .attr('class', 'poll-date')
    .text((d) => '    created: '+(new Date(d.created)).toLocaleString());
};

userHandler.showSomePolls = function(json) {
  document.cookie = 'lastPoll=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  var polls = d3.select('#poll-holder').selectAll('.poll')
    .data(json);
  polls.enter().each(userHandler.addSinglePoll)
  polls.exit().remove();
};

userHandler.showAllPolls = function() {
  var active = 'top-bar-box-active';
  d3.select('.' + active).classed(active, false);
  d3.select('#all-polls').classed(active, true);
  userHandler.ajaxJson('/api/all_polls', userHandler.showSomePolls)
};

userHandler.showUserPolls = function(user){
  var active = 'top-bar-box-active';
  d3.select('.' + active).classed(active, false);
  d3.select('#my-polls').classed(active, true);
  userHandler.ajaxJson('/api/user_polls/' + user, userHandler.showSomePolls);
};

userHandler.buildProfile = function() {
  document.cookie = 'lastPoll=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  var profImg = document.querySelector('.profile-pic');
  var dispName = document.querySelector('.display-name');

  var pathname = window.location.pathname;
  var user = pathname.split('/');
  user = user[user.length - 1];

  // add user info (name + picture)
  userHandler.ajaxJson('/api/user/' + user, (json) => {
    profImg.setAttribute('src', json.github.photoUrl);
    dispName.innerHTML = json.github.displayName;
  });

  //link buttons to regenerate polls list
  d3.select('#my-polls').on('click', ()=>userHandler.showUserPolls(user));
  d3.select('#all-polls').on('click', userHandler.showAllPolls);

  // add polls (defeault is user)
  userHandler.showUserPolls(user);
};