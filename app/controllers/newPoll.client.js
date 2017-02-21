var addNewOption = function(startVal, isPermanent) {
  var num = countOptions();
  var newId = 'form-option-' + num;
  var newField = d3.select('.option-holder').append('div').attr('class', 'form-group form-option');
  var input = newField.append('input');
  input.attr('type', 'textarea')
    .attr('class', 'form-control')
    .attr('id', newId)
    .attr('name', 'option-' + num)
    .attr('required', 'true')
    .attr('value', startVal)
    .on('blur', () => {
      if (isPermanent) return;
      if (countOptions() < 3) return;
      if (input.node().value.trim() === "") {
        newField.remove();
      };
    })
    .on('focus', () => input.node().select());
  input.node().focus();
}

var countOptions = ()=>d3.selectAll('.form-option').size();

d3.select('#form-add-option')
  .on('click', ()=>addNewOption('new option'));

// don't submit form when pressing enter
d3.select('form')
  .on('keydown', function() {
    if (d3.event.keyCode === 13) d3.event.preventDefault();
  })

oldPoll = {};
oldPoll.populate = function() {
  var pollId = window.location.pathname.split('/')[4]   //should be /profile/:id/poll/id
  userHandler.ajaxJson('/api/poll/' + pollId, (json) => {
    document.getElementById('form-title').value = json.title;
    document.getElementById('form-description').value = json.description;
    var form = d3.select('form').append('input')
      .attr('type', 'text')
      .attr('value', json['_id'])
      .attr('name', 'id')
      .classed('hidden-input', true);
    var options = d3.selectAll('.form-options')
        .data(json.votes);
    options.enter().each((d) => addNewOption(d.optionText, true))
      .merge(options);
  });
};