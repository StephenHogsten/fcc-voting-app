d3.select('#form-add-option')
  .on('click', function() {
    var newId = d3.selectAll('.form-options').size();
    d3.select('form').insert('div', '#form-add-option')
      .attr('class', 'form-group form-option')
      .append('input')
        .attr('type', 'textarea')
        .attr('class', 'form-control')
        .attr('id', 'form-option-' + newId)
        .attr('name', 'option-' + newId)
        .attr('placeholder', 'new option');
  });

// don't submit form when pressing enter
d3.select('form')
  .on('keydown', function() {
    if (d3.event.keyCode === 13) d3.event.preventDefault();
  });